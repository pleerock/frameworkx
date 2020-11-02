import {
  ActionDeclarationItemResolver,
  ActionTypeMetadata,
  DefaultContext,
  LogEvent,
  QueryMutationDeclarationItemResolver,
  SubscriptionDeclarationItemResolver,
  TypeMetadata,
} from "@microframework/core"
import DataLoader from "dataloader"
import { withFilter } from "graphql-subscriptions"
import { GraphQLFieldResolver } from "graphql/type/definition"
import { ApplicationServerProperties } from "../application-server/ApplicationServerProperties"
import { LoggerHelper } from "./LoggerHelper"
import { RateLimitItemOptions } from "../rate-limit"
import { ValidationHelper } from "./ValidationHelper"

/**
 * Helper over resolving operations.
 */
export class ResolverHelper {
  private loggerHelper: LoggerHelper
  private validator: ValidationHelper
  private properties: ApplicationServerProperties

  constructor(logger: LoggerHelper, properties: ApplicationServerProperties) {
    this.loggerHelper = logger
    this.properties = properties
    this.validator = new ValidationHelper(
      properties.validator,
      properties.validationRules,
    )
  }

  findAction(
    name: string,
  ): ActionDeclarationItemResolver<any, any> | undefined {
    for (let resolver of this.properties.resolvers) {
      if (resolver.type === "declaration-resolver") {
        if (
          resolver.declarationType === "any" ||
          resolver.declarationType === "action"
        ) {
          if ((resolver.resolverFn as any)[name] !== undefined) {
            return (resolver.resolverFn as any)[name].bind(resolver.resolverFn)
          }
        }
      } else if (resolver.type === "declaration-item-resolver") {
        if (
          resolver.declarationType === "any" ||
          resolver.declarationType === "action"
        ) {
          if (resolver.name === name) {
            return resolver.resolverFn as ActionDeclarationItemResolver<
              any,
              any
            >
          }
        }
      }
    }

    return undefined
  }

  findSubscriptionResolver(name: string) {
    for (let resolver of this.properties.resolvers) {
      if (resolver.type === "declaration-resolver") {
        if (
          resolver.declarationType === "any" ||
          resolver.declarationType === "subscription"
        ) {
          if ((resolver.resolverFn as any)[name] !== undefined) {
            if ((resolver.resolverFn as any)[name] instanceof Function) {
              return (resolver.resolverFn as any)[name].bind(
                resolver.resolverFn,
              ) // (...args: any[]) => (resolver.resolverFn as any)[name](...args)
            } else {
              return (resolver.resolverFn as any)[name] // (...args: any[]) => (resolver.resolverFn as any)[name](...args)
            }
          }
        }
      } else if (resolver.type === "declaration-item-resolver") {
        if (
          resolver.declarationType === "any" ||
          resolver.declarationType === "subscription"
        ) {
          if (resolver.name === name) {
            return resolver.resolverFn as SubscriptionDeclarationItemResolver<
              any,
              any
            >
          }
        }
      }
    }

    return undefined
  }

  async buildContext(defaultContext: DefaultContext) {
    let resolvedContext: { [key: string]: any } = { ...defaultContext }

    // do we need a "proper" context based on properties defined in the App ?
    // for (let contextItem of this.app.metadata.context)

    for (let resolver of this.properties.resolvers) {
      if (resolver.type === "context") {
        for (let contextKey in resolver.resolverFn) {
          if (resolver.resolverFn.hasOwnProperty(contextKey)) {
            const contextItem = resolver.resolverFn[contextKey]
            let result =
              contextItem instanceof Function
                ? contextItem(defaultContext)
                : contextItem
            if (result instanceof Promise) {
              result = await result
            }
            resolvedContext[contextKey] = result
          }
        }
      }
    }
    return resolvedContext
  }

  createGraphQLTypeResolver(
    type: "query" | "mutation" | "subscription" | "model",
    metadata: TypeMetadata,
    resolverFn: any,
    modelName?: string,
  ): GraphQLFieldResolver<any, any, any> | undefined {
    return async (parent: any, args: any, context: any, info: any) => {
      const logEvent: LogEvent = {
        request: context.request,
        response: context.response,
        typeMetadata: metadata,
        modelName,
        propertyName: metadata.propertyName,
        graphQLResolverArgs: { parent, args, context, info },
      }
      const logger = this.loggerHelper.createContextLogger(type, logEvent)
      const defaultContext: DefaultContext = {
        ...context,
        logger: logger,
      }
      if ((defaultContext as any)["dataLoaders"])
        delete (defaultContext as any)["dataLoaders"]
      try {
        // log resolving start process
        logger.log(
          `${Object.keys(args).length ? `args(${JSON.stringify(args)})` : ""}`,
        )
        const userContext = await this.buildContext(defaultContext)

        // validate args
        if (metadata.args)
          await this.validator.validate(metadata.args, args, userContext)

        // execute the resolver and get the value it returns
        let result: any
        if (resolverFn instanceof Function) {
          const resolveArgs = []
          if (type === "model") resolveArgs.push(parent)
          if (metadata.args) resolveArgs.push(args)
          resolveArgs.push(userContext)
          result = await resolverFn(...resolveArgs)
        } else {
          result = resolverFn
        }

        // perform returning value model validation
        await this.validator.validate(metadata, result, context)

        // log once again after resolver execution is finished
        logger.log(`return(${JSON.stringify(result)})`) // this.logger.logGraphQLResponse({ ...logInfo, content: result })
        return result
      } catch (error) {
        logger.error(error)
        this.properties.errorHandler.resolverError(error, logEvent)
      }
    }
  }

  createGraphQLTypeDataLoaderResolver(
    metadata: TypeMetadata,
    resolverFn: any,
    modelName: string,
  ): GraphQLFieldResolver<any, any, any> | undefined {
    const type = "model"
    return async (parent: any, args: any, context: any, info: any) => {
      const logEvent: LogEvent = {
        request: context.request,
        response: context.response,
        typeMetadata: metadata,
        modelName,
        propertyName: metadata.propertyName,
        graphQLResolverArgs: { parent, args, context, info },
      }
      const logger = this.loggerHelper.createContextLogger(type, logEvent)
      const defaultContext: DefaultContext = {
        ...context,
        logger,
      }
      if ((defaultContext as any)["dataLoaders"])
        delete (defaultContext as any)["dataLoaders"]
      try {
        if (!context.dataLoaders) context.dataLoaders = {}
        if (!context.dataLoaders[modelName]) context.dataLoaders[modelName] = {}

        // log resolving start process
        logger.log(
          `[data-loader]${
            Object.keys(args).length ? ` args(${JSON.stringify(args)})` : ""
          }`,
        )

        if (!context.dataLoaders[modelName][metadata.propertyName!!]) {
          context.dataLoaders[modelName][
            metadata.propertyName!!
          ] = new DataLoader(
            async (keys) => {
              try {
                const entities = keys.map((key) => key.parent)
                const userContext = await this.buildContext(defaultContext)

                // validate args
                if (metadata.args)
                  await this.validator.validate(
                    metadata.args,
                    args,
                    userContext,
                  )

                // execute the resolver and get the value it returns
                let result: any
                if (resolverFn instanceof Function) {
                  const resolveArgs = [entities]
                  if (metadata.args) resolveArgs.push(args)
                  result = await resolverFn(...resolveArgs, userContext)
                } else {
                  result = resolverFn
                }

                // perform returning value model validation
                // it means data-loader is used, we need to validate each model in the array
                await Promise.all(
                  result.map((item: any) => {
                    return this.validator.validate(metadata, item, context)
                  }),
                )

                return result
              } catch (err) {
                // todo: not sure if we should handle it here, need to check
                // this.logger.resolveError(err)
                // this.errorHandler.resolverError(err)
                throw err
              }
            },
            {
              cacheKeyFn: (key: {
                parent: any
                args: any
                context: any
                info: any
              }) => {
                return JSON.stringify({ parent: key.parent, args: key.args })
              },
            },
          )
        }

        const dataLoaderResolver =
          context.dataLoaders[modelName][metadata.propertyName!!]
        const result = await dataLoaderResolver.load({
          parent,
          args,
          context,
          info,
        })

        // log once again after resolver execution is finished
        logger.log(`[data-loader] return(${JSON.stringify(result)})`)
        return result
      } catch (error) {
        logger.log(error)
        this.properties.errorHandler.resolverError(error, logEvent)
      }
    }
  }

  createGraphQLTypeGeneratedRelationResolver(
    metadata: TypeMetadata,
    resolverFn: any,
    modelName: string,
  ): GraphQLFieldResolver<any, any, any> | undefined {
    const type = "model"
    return async (parent: any, args: any, context: any, info: any) => {
      const logEvent: LogEvent = {
        request: context.request,
        response: context.response,
        typeMetadata: metadata,
        modelName,
        propertyName: metadata.propertyName,
        graphQLResolverArgs: { parent, args, context, info },
      }
      const logger = this.loggerHelper.createContextLogger(type, logEvent)
      const defaultContext: DefaultContext = {
        request: context.request,
        response: context.response,
        logger,
      }
      try {
        if (!context.dataLoaders) context.dataLoaders = {}
        if (!context.dataLoaders[modelName]) context.dataLoaders[modelName] = {}

        // log resolving start process
        logger.log(
          `[generated] ${
            Object.keys(args).length ? `(${JSON.stringify(args)})` : ""
          }`,
        )

        if (!context.dataLoaders[modelName][metadata.propertyName!!]) {
          context.dataLoaders[modelName][
            metadata.propertyName!!
          ] = new DataLoader(
            async (keys) => {
              try {
                const entities = keys.map((key) => key.parent)
                const userContext = await this.buildContext(defaultContext)

                // validate args
                if (metadata.args)
                  await this.validator.validate(
                    metadata.args,
                    args,
                    userContext,
                  )

                // execute the resolver and get the value it returns
                let result: any
                if (resolverFn instanceof Function) {
                  const resolveArgs = [entities]
                  if (metadata.args) resolveArgs.push(args)
                  result = await resolverFn(...resolveArgs, userContext)
                } else {
                  result = resolverFn
                }

                // perform returning value model validation
                // it means data-loader is used, we need to validate each model in the array
                await Promise.all(
                  result.map((item: any) => {
                    return this.validator.validate(metadata, item, context)
                  }),
                )

                return result
              } catch (err) {
                // todo: not sure if we should handle it here, need to check
                // this.logger.resolveError(args)
                // this.errorHandler.resolverError(args)
                throw err
              }
            },
            {
              cacheKeyFn: (key: {
                parent: any
                args: any
                context: any
                info: any
              }) => {
                return JSON.stringify({ parent: key.parent, args: key.args })
              },
            },
          )
        }

        const dataLoaderResolver =
          context.dataLoaders[modelName][metadata.propertyName!!]
        const result = await dataLoaderResolver.load({
          parent,
          args,
          context,
          info,
        })

        // log once again after resolver execution is finished
        logger.log(`[generated] "${JSON.stringify(result)}"`)
        return result
      } catch (error) {
        logger.error(error)
        this.properties.errorHandler.resolverError(error, logEvent)
      }
    }
  }

  createSubscribeResolver({
    pubSub,
    hasArgs,
    subscriptionResolverFn,
  }: {
    pubSub: any
    hasArgs: boolean
    subscriptionResolverFn: any
  }): GraphQLFieldResolver<any, any, any> {
    // todo: rate limitation
    const resolver = (_: any, args: any, context: any) => {
      const asyncIterator = pubSub.asyncIterator(
        subscriptionResolverFn.triggers,
      )
      const callArgs = hasArgs ? [args, context] : [context]
      if (subscriptionResolverFn.onSubscribe)
        subscriptionResolverFn.onSubscribe(...callArgs)

      if (subscriptionResolverFn.onUnsubscribe) {
        this.withCancel(asyncIterator, () =>
          subscriptionResolverFn.onUnsubscribe(...callArgs),
        )
      }
      return asyncIterator
    }
    if (subscriptionResolverFn.filter) {
      return withFilter(resolver, subscriptionResolverFn.filter)
    } else {
      return resolver
    }
  }

  async createActionResolver(
    request: any,
    response: any,
    actionMetadata: ActionTypeMetadata,
  ) {
    const logEvent: LogEvent = {
      request,
      response,
      actionMetadata,
    }
    const logger = this.loggerHelper.createContextLogger("action", logEvent)
    const defaultContext: DefaultContext = { request, response, logger }
    logger.log("") // this.logger.resolveAction(actionEvent)
    try {
      let actionResolverFn = this.findAction(actionMetadata.name)
      if (!actionResolverFn)
        throw new Error(`Action resolver ${actionMetadata.name} was not found`)

      // todo: fix types of params/queries,etc not being normalized based on type metadata
      // let actionParams: any
      // let actionQuery: any
      // let actionHeader: any
      // let actionCookie: any
      // if (actionParams) {
      //     if (actionMetadata.params) {
      //
      //     }
      // }

      actionResolverFn = this.applyRateLimitOptions(
        "action",
        actionMetadata.name,
        undefined,
        actionResolverFn,
        () => request.ip,
      )

      const context = await this.buildContext(defaultContext)
      const result = actionResolverFn(
        {
          params: this.buildActionParams(request.params, actionMetadata.params),
          query: this.buildActionParams(request.query, actionMetadata.query),
          headers: this.buildActionParams(
            request.header,
            actionMetadata.headers,
          ),
          cookies: this.buildActionParams(
            request.cookies,
            actionMetadata.cookies,
          ),
          body: request.body,
        },
        context,
      )

      if (result instanceof Promise) {
        return result
          .then((result) => {
            logger.log(`return(${JSON.stringify(result)})`) // this.logger.logActionResponse({ ...actionEvent, content: result })
            return result
          })
          .then((result) => {
            if (actionMetadata.return !== undefined) response.json(result)
          })
          .catch((error) => {
            logger.error(error) // this.logger.resolveActionError({ ...actionEvent, error })
            return this.properties.errorHandler.actionError(error, logEvent)
          })
      } else {
        // this.logger.logActionResponse({ ...actionEvent, content: result })
        if (actionMetadata.return !== undefined) {
          logger.log(`return(${JSON.stringify(result)})`)
          response.json(result)
        }
      } // think about text responses, status, etc.
    } catch (error) {
      logger.error(error) // this.logger.resolveActionError({ ...actionEvent, error })
      return this.properties.errorHandler.actionError(error, logEvent)
    }
  }

  withCancel = (asyncIterator: any, onCancel: () => any) => {
    const asyncReturn = asyncIterator.return

    asyncIterator.return = () => {
      onCancel()
      return asyncReturn
        ? asyncReturn.call(asyncIterator)
        : Promise.resolve({ value: undefined, done: true })
    }

    return asyncIterator
  }

  findDataLoaderResolver(modelName: string, propertyName: string) {
    let dataLoaderResolverFn:
      | QueryMutationDeclarationItemResolver<any, any>
      | undefined = undefined
    for (let resolver of this.properties.resolvers) {
      if (
        resolver.type === "model-resolver" &&
        resolver.name === modelName &&
        resolver.dataLoader === true
      ) {
        if ((resolver.resolverFn as any)[propertyName] !== undefined) {
          dataLoaderResolverFn = (resolver.resolverFn as any)[
            propertyName
          ].bind(resolver.resolverFn) // (...args: any[]) => (resolver.resolverFn as any)[name](...args)
        }
      }
    }

    return dataLoaderResolverFn
  }

  private applyRateLimitOptions<T>(
    declarationType: "query" | "mutation" | "any" | "models" | "action",
    name: string,
    parentTypeName: string | undefined,
    resolverFn: T,
    resolverIpFactory: (args: any[]) => string,
  ): T {
    if (this.properties.rateLimits) {
      if (!this.properties.rateLimitConstructor)
        throw new Error(
          `You must set "rateLimitConstructor" to use rate limiting options.`,
        )

      let rateLimitOptions: RateLimitItemOptions | undefined = undefined
      if (
        declarationType === "query" &&
        this.properties.rateLimits["queries"]
      ) {
        rateLimitOptions = this.properties.rateLimits["queries"][name]
      } else if (
        declarationType === "mutation" &&
        this.properties.rateLimits["mutations"]
      ) {
        rateLimitOptions = this.properties.rateLimits["mutations"][name]
      } else if (declarationType === "any") {
        if (this.properties.rateLimits["queries"]?.[name]) {
          rateLimitOptions = this.properties.rateLimits["queries"][name]
        }
        if (this.properties.rateLimits["mutations"]?.[name]) {
          rateLimitOptions = this.properties.rateLimits["mutations"][name]
        }
      } else if (
        declarationType === "models" &&
        parentTypeName &&
        this.properties.rateLimits["models"]?.[parentTypeName]?.[name]
      ) {
        rateLimitOptions = this.properties.rateLimits["models"]?.[
          parentTypeName
        ]?.[name]
      } else if (
        declarationType === "action" &&
        this.properties.rateLimits["actions"]
      ) {
        rateLimitOptions = this.properties.rateLimits["actions"][name]
      }

      if (rateLimitOptions) {
        const rateLimiter = this.properties.rateLimitConstructor(
          rateLimitOptions,
        )
        return (async (...args: any[]) => {
          // console.log("ip", args[argsParameterIndex].request.ip)
          // await rateLimiter.consume(args[argsParameterIndex].request.ip)
          await rateLimiter.consume(resolverIpFactory(args))
          return (resolverFn as any)(...args)
        }) as any
      }
    }
    return resolverFn
  }

  findGraphQLDeclaration(
    type: "query" | "mutation" | /* | "subscription"*/ "model",
    name: string,
    parentTypeName?: string,
    hasArgs: boolean = false,
  ) {
    if (type === "query" || type === "mutation") {
      let resolverFn:
        | QueryMutationDeclarationItemResolver<any, any>
        | undefined = undefined
      for (let resolver of this.properties.resolvers) {
        if (resolver.type === "declaration-resolver") {
          if (
            resolver.declarationType === "any" ||
            resolver.declarationType === type
          ) {
            if ((resolver.resolverFn as any)[name] !== undefined) {
              resolverFn = (resolver.resolverFn as any)[name].bind(
                resolver.resolverFn,
              ) // (...args: any[]) => (resolver.resolverFn as any)[name](...args)
              resolverFn = this.applyRateLimitOptions(
                resolver.declarationType,
                name,
                parentTypeName,
                resolverFn,
                (args: any[]) =>
                  hasArgs ? args[1].request.ip : args[0].request.ip,
              )
            }
          }
        } else if (resolver.type === "declaration-item-resolver") {
          if (
            resolver.declarationType === "any" ||
            resolver.declarationType === type
          ) {
            if (resolver.name === name) {
              resolverFn = resolver.resolverFn // as SubscriptionDeclarationItemResolver<any, any>
              resolverFn = this.applyRateLimitOptions(
                resolver.declarationType,
                name,
                parentTypeName,
                resolverFn,
                (args: any[]) =>
                  hasArgs ? args[1].request.ip : args[0].request.ip,
              )
            }
          }
        }
      }
      return resolverFn
    } else if (type === "model") {
      let resolverFn:
        | QueryMutationDeclarationItemResolver<any, any>
        | undefined = undefined
      for (let resolver of this.properties.resolvers) {
        if (
          resolver.type === "model-resolver" &&
          resolver.name === parentTypeName &&
          resolver.dataLoader === false
        ) {
          if ((resolver.resolverFn as any)[name] !== undefined) {
            resolverFn = (resolver.resolverFn as any)[name].bind(
              resolver.resolverFn,
            ) // (...args: any[]) => (resolver.resolverFn as any)[name](...args)
            resolverFn = this.applyRateLimitOptions(
              "models",
              name,
              parentTypeName,
              resolverFn,
              (args: any[]) =>
                hasArgs ? args[2].request.ip : args[1].request.ip,
            )
          }
        }
      }

      return resolverFn
    }
  }

  private buildActionParams(
    requestParams: any,
    paramsMetadata: TypeMetadata | undefined,
  ) {
    if (paramsMetadata) {
      for (let metadata of paramsMetadata.properties) {
        if (!metadata.propertyName) continue
        if (typeof requestParams[metadata.propertyName] !== "string") continue
        if (metadata.kind === "number") {
          requestParams[metadata.propertyName] = parseInt(
            requestParams[metadata.propertyName],
          )
        } else if (metadata.kind === "bigint") {
          requestParams[metadata.propertyName] = BigInt(
            requestParams[metadata.propertyName],
          )
        } else if (metadata.kind === "boolean") {
          requestParams[metadata.propertyName] =
            requestParams[metadata.propertyName] === "true" ||
            requestParams[metadata.propertyName] === "1"
        }
      }
    }
    return requestParams
  }

  // stringify(value: any) {
  //   return JSON.stringify(value, (key, value) => {
  //     typeof value === "bigint" ? value.toString() : value
  //   })
  // }
}
