import {
    ActionItemResolver,
    ActionTypeMetadata,
    DefaultContext,
    QueryMutationItemResolver,
    SubscriptionItemResolver,
    TypeMetadata
} from "@microframework/core"
import DataLoader from "dataloader";
import { Request, Response } from "express";
import { withFilter } from "graphql-subscriptions";
import { GraphQLFieldResolver } from "graphql/type/definition";
import { ActionEvent } from "./action/ActionEvent";
import { ApplicationServerProperties } from "./ApplicationServerProperties";
import { ResolveLogInfo, ServerLogger } from "./ServerLogger";
import { ValidationHelper } from "./ValidationHelper";

export class ResolverHelper {

    private logger: ServerLogger
    private validator: ValidationHelper

    constructor(
        public properties: ApplicationServerProperties,
    ) {
        this.logger = new ServerLogger(properties.logger)
        this.validator = new ValidationHelper(properties.validator, properties.validationRules)
    }

    findAction(name: string): ActionItemResolver<any, any> | undefined {
        for (let resolver of this.properties.resolvers) {
            if (resolver.type === "declaration-resolver") {
                if (resolver.declarationType === "any" || resolver.declarationType === "action") {
                    if ((resolver.resolverFn as any)[name] !== undefined) {
                        return (resolver.resolverFn as any)[name].bind(resolver.resolverFn)
                    }
                }
            } else if (resolver.type === "declaration-item-resolver") {
                if (resolver.declarationType === "any" || resolver.declarationType === "action") {
                    if (resolver.name === name) {
                        return resolver.resolverFn as ActionItemResolver<any, any>
                    }
                }
            }
        }

        return undefined
    }
    
    findSubscriptionResolver(name: string) {
        for (let resolver of this.properties.resolvers) {
            if (resolver.type === "declaration-resolver") {
                if (resolver.declarationType === "any" || resolver.declarationType === "subscription") {
                    if ((resolver.resolverFn as any)[name] !== undefined) {
                        return (resolver.resolverFn as any)[name].bind(resolver.resolverFn) // (...args: any[]) => (resolver.resolverFn as any)[name](...args)
                    }
                }
            } else if (resolver.type === "declaration-item-resolver") {
                if (resolver.declarationType === "any" || resolver.declarationType === "subscription") {
                    if (resolver.name === name) {
                        return resolver.resolverFn as SubscriptionItemResolver<any, any>
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
                        let result = contextItem instanceof Function ? contextItem(defaultContext) : contextItem
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
        parentTypeName?: string,
    ): GraphQLFieldResolver<any, any, any> | undefined {
        return async (parent: any, args: any, context: any, info: any) => {
            const defaultContext: DefaultContext = {
                request: context.request,
                response: context.response,
                // logger: () => {} // todo!
            }
            const logInfo: ResolveLogInfo = {
                type,
                metadata,
                defaultContext,
                parentTypeName,
                args: { parent, args, context, info }
            }
            try {

                // log resolving start process
                this.logger.logBeforeResolve(logInfo)
                const userContext = await this.buildContext(defaultContext)

                // validate args
                if (metadata.args)
                    await this.validator.validate(metadata.args, args, userContext)

                // execute the resolver and get the value it returns
                let result: any
                if (resolverFn instanceof Function) {
                    const resolveArgs = []
                    if (type === "model")
                        resolveArgs.push(parent)
                    if (metadata.args)
                        resolveArgs.push(args)
                    resolveArgs.push(userContext)
                    result = await resolverFn(...resolveArgs)
                } else {
                    result = resolverFn
                }

                // perform returning value model validation
                await this.validator.validate(metadata, result, context)

                // log once again after resolver execution is finished
                this.logger.logGraphQLResponse({ ...logInfo, content: result })
                return result

            } catch (error) {
                this.logger.resolveError(args)
                this.properties.errorHandler.resolverError(args)
                // throw error // todo: check if we need it (if yes check if resolverError can do it)
            }
        }
    }

    createGraphQLTypeDataLoaderResolver(
        metadata: TypeMetadata,
        resolverFn: any,
        parentTypeName: string,
    ): GraphQLFieldResolver<any, any, any> | undefined {
        const type = "model"
        return async (parent: any, args: any, context: any, info: any) => {
            const defaultContext: DefaultContext = {
                request: context.request,
                response: context.response,
                // logger: () => {} // todo!
            }
            const logInfo: ResolveLogInfo = {
                type,
                metadata,
                defaultContext,
                parentTypeName,
                args: { parent, args, context, info }
            }
            try {

                if (!context.dataLoaders)
                    context.dataLoaders = {};
                if (!context.dataLoaders[parentTypeName])
                    context.dataLoaders[parentTypeName] = {};

                // log resolving start process
                this.logger.logBeforeResolve(logInfo)

                if (!context.dataLoaders[parentTypeName][metadata.propertyName!!]) {
                    context.dataLoaders[parentTypeName][metadata.propertyName!!] = new DataLoader(
                        async (keys: { parent: any, args: any, context: any, info: any }[]) => {
                            try {

                                const entities = keys.map(key => key.parent)
                                const userContext = await this.buildContext(defaultContext)

                                // validate args
                                if (metadata.args)
                                    await this.validator.validate(metadata.args, args, userContext)

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
                                await Promise.all(result.map((item: any) => {
                                    return this.validator.validate(metadata, item, context)
                                }))

                                return result
                            } catch (err) {
                                // todo: not sure if we should handle it here, need to check
                                // this.logger.resolveError(args)
                                // this.errorHandler.resolverError(args)
                                throw err
                            }
                        }, {
                            cacheKeyFn: (key: { parent: any, args: any, context: any, info: any }) => {
                                return JSON.stringify({parent: key.parent, args: key.args});
                            }
                        }
                    )
                }

                const dataLoaderResolver = context.dataLoaders[parentTypeName][metadata.propertyName!!]
                const result = await dataLoaderResolver.load({ parent, args, context, info })

                // log once again after resolver execution is finished
                this.logger.logGraphQLResponse({ ...logInfo, content: result })
                return result

            } catch (error) {
                this.logger.resolveError(args)
                this.properties.errorHandler.resolverError(args)
                // throw error // todo: check if we need it (if yes check if resolverError can do it)
            }
        }
    }

    createGraphQLTypeGeneratedRelationResolver(
        metadata: TypeMetadata,
        resolverFn: any,
        parentTypeName: string,
    ): GraphQLFieldResolver<any, any, any> | undefined {
        const type = "model"
        return async (parent: any, args: any, context: any, info: any) => {
            const defaultContext: DefaultContext = {
                request: context.request,
                response: context.response,
                // logger: () => {} // todo!
            }
            const logInfo: ResolveLogInfo = {
                type,
                metadata,
                defaultContext,
                parentTypeName,
                args: { parent, args, context, info }
            }
            try {

                if (!context.dataLoaders)
                    context.dataLoaders = {};
                if (!context.dataLoaders[parentTypeName])
                    context.dataLoaders[parentTypeName] = {};

                // log resolving start process
                this.logger.logBeforeResolve(logInfo)

                if (!context.dataLoaders[parentTypeName][metadata.propertyName!!]) {
                    context.dataLoaders[parentTypeName][metadata.propertyName!!] = new DataLoader(
                        async (keys: { parent: any, args: any, context: any, info: any }[]) => {
                            try {

                                const entities = keys.map(key => key.parent)
                                const userContext = await this.buildContext(defaultContext)

                                // validate args
                                if (metadata.args)
                                    await this.validator.validate(metadata.args, args, userContext)

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
                                await Promise.all(result.map((item: any) => {
                                    return this.validator.validate(metadata, item, context)
                                }))

                                return result
                            } catch (err) {
                                // todo: not sure if we should handle it here, need to check
                                // this.logger.resolveError(args)
                                // this.errorHandler.resolverError(args)
                                throw err
                            }
                        }, {
                            cacheKeyFn: (key: { parent: any, args: any, context: any, info: any }) => {
                                return JSON.stringify({parent: key.parent, args: key.args});
                            }
                        }
                    )
                }

                const dataLoaderResolver = context.dataLoaders[parentTypeName][metadata.propertyName!!]
                const result = await dataLoaderResolver.load({ parent, args, context, info })

                // log once again after resolver execution is finished
                this.logger.logGraphQLResponse({ ...logInfo, content: result })
                return result

            } catch (error) {
                this.logger.resolveError(args)
                this.properties.errorHandler.resolverError(args)
                // throw error // todo: check if we need it (if yes check if resolverError can do it)
            }
        }
    }

    createSubscribeResolver({ pubSub, hasArgs, subscriptionResolverFn }: {
        pubSub: any,
        hasArgs: boolean,
        subscriptionResolverFn: any,
    }): GraphQLFieldResolver<any, any, any> {
        if (subscriptionResolverFn.filter) {
            return (_, _args) => {
                return withFilter(
                    () => pubSub.asyncIterator(subscriptionResolverFn.triggers),
                    subscriptionResolverFn.filter!
                )
            }
        } else {
            return (_, args, context) => {
                const callArgs = hasArgs ? [hasArgs, context] : [context]
                if (subscriptionResolverFn.onSubscribe)
                    subscriptionResolverFn.onSubscribe(...callArgs)

                if (subscriptionResolverFn.onUnsubscribe) {
                    return this.withCancel(
                        pubSub.asyncIterator(subscriptionResolverFn.triggers),
                        () => subscriptionResolverFn.onUnsubscribe(...callArgs)
                    )
                }
                return pubSub.asyncIterator(subscriptionResolverFn.triggers)
            }
        }
    }

    async createActionResolver(actionEvent: ActionEvent, actionMetadata: ActionTypeMetadata) {
        const { request, response } = actionEvent
        this.logger.resolveAction(actionEvent)
        try {

            // TODO: FIX TYPES OF PARAMS/QUERIES,ETC NOT BEING NORMALIZED BASED ON TYPE METADATA
            let actionResolverFn = this.findAction(actionMetadata.name)
            if (!actionResolverFn)
                throw new Error(`Action resolver ${actionMetadata.name} was not found`)

            const context = await this.buildContext({ request, response })
            const result = actionResolverFn({
                params: request.params,
                query: request.query,
                header: request.header,
                cookies: request.cookies,
                body: request.body,
            }, context)

            if (result instanceof Promise) {
                return result
                    .then(result => {
                        this.logger.logActionResponse({ ...actionEvent, content: result })
                        return result
                    })
                    .then(result => {
                        if (actionMetadata.return !== undefined)
                            response.json(result)
                    })
                    .catch(error => {
                        this.logger.resolveActionError({ ...actionEvent, error })
                        return this.properties.errorHandler.actionError({ ...actionEvent, error })
                    })
            } else {
                this.logger.logActionResponse({ ...actionEvent, content: result })
                if (actionMetadata.return !== undefined) {
                    response.json(result)
                }
            } // think about text responses, status, etc.

        } catch (error) {
            this.logger.resolveActionError({ ...actionEvent, error })
            return this.properties.errorHandler.actionError({ ...actionEvent, error })
        }
    }

    withCancel = (asyncIterator: any, onCancel: () => any) => {
        const asyncReturn = asyncIterator.return;

        asyncIterator.return = () => {
            onCancel();
            return asyncReturn ? asyncReturn.call(asyncIterator) : Promise.resolve({value: undefined, done: true});
        };

        return asyncIterator;
    };

    findDataLoaderResolver(modelName: string, propertyName: string) {
        let dataLoaderResolverFn: QueryMutationItemResolver<any, any> | undefined = undefined
        for (let resolver of this.properties.resolvers) {
            if (resolver.type === "model-resolver" && resolver.name === modelName && resolver.dataLoader === true) {
                if ((resolver.resolverFn as any)[propertyName] !== undefined) {
                    dataLoaderResolverFn = (resolver.resolverFn as any)[propertyName].bind(resolver.resolverFn) // (...args: any[]) => (resolver.resolverFn as any)[name](...args)
                }
            }
        }

        return dataLoaderResolverFn
    }

    findGraphQLDeclaration(type: "query" | "mutation"/* | "subscription"*/ | "model", name: string) {
        if (type === "query" || type === "mutation") {
            let resolverFn: QueryMutationItemResolver<any, any> | undefined = undefined
            for (let resolver of this.properties.resolvers) {
                if (resolver.type === "declaration-resolver") {
                    if (resolver.declarationType === "any" || resolver.declarationType === type) {
                        if ((resolver.resolverFn as any)[name] !== undefined) {
                            resolverFn = (resolver.resolverFn as any)[name].bind(resolver.resolverFn) // (...args: any[]) => (resolver.resolverFn as any)[name](...args)
                        }
                    }
                } else if (resolver.type === "declaration-item-resolver") {
                    if (resolver.declarationType === "any" || resolver.declarationType === type) {
                        if (resolver.name === name) {
                            resolverFn = resolver.resolverFn as SubscriptionItemResolver<any, any>
                        }
                    }
                }
            }
            return resolverFn

        } else if (type === "model") {
            let resolverFn: QueryMutationItemResolver<any, any> | undefined = undefined
            for (let resolver of this.properties.resolvers) {
                if (resolver.type === "model-resolver" && resolver.dataLoader === false) {
                    if ((resolver.resolverFn as any)[name] !== undefined) {
                        resolverFn = (resolver.resolverFn as any)[name].bind(resolver.resolverFn) // (...args: any[]) => (resolver.resolverFn as any)[name](...args)
                    }
                }
            }

            return resolverFn
        }
    }
}
