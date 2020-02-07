import {
  ActionItemResolver,
  AnyApplication,
  AnyApplicationOptions,
  Application,
  TypeMetadata
} from "@microframework/core";
import { ApplicationServer } from "@microframework/core";
import { DeclarationResolverMetadata, isResolverMetadata, ResolverMetadata } from "@microframework/core/_";
import { parse } from "@microframework/parser";
import { Request, Response } from "express";
import * as fs from "fs"
import { execute, GraphQLError, GraphQLSchema, GraphQLSchemaConfig, subscribe } from "graphql";
import { createServer } from 'http';
import * as path from "path"
import { SubscriptionServer } from "subscriptions-transport-ws";
import { DefaultErrorHandler } from "./error-handler";
import { generateEntityResolvers } from "./generateEntityResolvers";
import { DefaultNamingStrategy } from "./naming-strategy/DefaultNamingStrategy";
import { ServerProperties } from "./ServerProperties";
import { TypeToGraphQLSchemaConverter } from "./TypeToGraphQLSchemaConverter";
import { Utils } from "./utils";
import cors = require("cors");

const express = require("express")
const graphqlHTTP = require("express-graphql")

export const defaultServer = <Options extends AnyApplicationOptions>(
  app: Application<Options>,
  properties: ServerProperties
): ApplicationServer => {
  return async (/*options: AnyApplicationOptions*/) => {

    if (!properties.maxGeneratedConditionsDeepness) {
      properties.maxGeneratedConditionsDeepness = 5
    }
    if (!properties.namingStrategy) {
      properties.namingStrategy = DefaultNamingStrategy
    }
    if (!properties.errorHandler) {
      properties.errorHandler = DefaultErrorHandler
    }

    const resolvers: ResolverMetadata[] = []
    if (properties.resolvers instanceof Array) {
      resolvers.push(...properties.resolvers.map(resolver => {
        if (resolver instanceof Function) {
          return resolver.prototype.resolver

        } else if (resolver instanceof Object && !isResolverMetadata(resolver)) {
          return {
            instanceof: "Resolver",
            type: "declaration-resolver",
            declarationType: "any",
            resolverFn: resolver,
          } as DeclarationResolverMetadata

        } else {
          return resolver
        }
      }))

    } else {
      resolvers.push(...Object.keys(properties.resolvers).map(key => {
        const resolver = (properties.resolvers as any)[key]
        if (resolver instanceof Function) {
          return resolver.prototype.resolver

        } else if (resolver instanceof Object && !isResolverMetadata(resolver)) {
          return {
            instanceof: "Resolver",
            type: "declaration-resolver",
            declarationType: "any",
            resolverFn: resolver,
          } as DeclarationResolverMetadata

        } else {
          return resolver
        }
      }))
    }



    const tsFilePath = path.normalize(properties.appPath + ".ts")
    const dtsFilePath = path.normalize(properties.appPath + ".d.ts")

    if (fs.existsSync(tsFilePath)) {
      app.setMetadata(parse(tsFilePath))
    } else if (fs.existsSync(dtsFilePath)) {
      app.setMetadata(parse(dtsFilePath))
    } else {
      throw new Error(`${tsFilePath} or ${dtsFilePath} were not found!`)
    }


    if (properties.dataSourceFactory) {
      const connection = await properties.dataSourceFactory( { mappedEntitySchemaProperties: Utils.modelsToApp(app.metadata.models) })
      properties.dataSource = connection
    }


    const entityResolvers = generateEntityResolvers(app, properties) /*{
      queryResolverSchema: [],
      mutationResolverSchema: [],
      queryDeclarations: [],
      mutationDeclarations: [],
    }*/

    const queries: TypeMetadata[] = [
      ...(app.metadata.queries || []),
      ...entityResolvers.queryDeclarations,
      // ...result.queryDeclarations,
    ]

    const mutations: TypeMetadata[] = [
      ...(app.metadata.mutations || []),
      ...entityResolvers.mutationDeclarations,
    ]

    // console.log("app.metadata.subscriptions", app.metadata.subscriptions);

    const subscriptions: TypeMetadata[] = [
      ...(app.metadata.subscriptions || []),
      ...entityResolvers.subscriptionDeclarations,
    ]

    resolvers.push(...entityResolvers.queryResolverSchema)
    resolvers.push(...entityResolvers.mutationResolverSchema)
    resolvers.push(...entityResolvers.subscriptionResolverSchema)

    // create and setup express server
    const expressApp = properties.express || express()
    if (properties.cors === true) {
      expressApp.use(cors())

    } else if (properties.cors instanceof Object) {
      expressApp.use(cors(properties.cors))
    }

    // setip graphql
    if (Object.keys(queries).length || Object.keys(mutations).length) {
      const typeRegistry = new TypeToGraphQLSchemaConverter({
        app,
        properties,
        resolvers
      })

      let config: GraphQLSchemaConfig = {
        types: typeRegistry.types,
        query: undefined
      }
      if (Object.keys(queries).length > 0) {
        config.query = typeRegistry.declarationToGraphQLObjectType("query", queries)
      }
      if (Object.keys(mutations).length > 0) {
        config.mutation = typeRegistry.declarationToGraphQLObjectType("mutation", mutations)
      }
      if (Object.keys(subscriptions).length > 0) {
        config.subscription = typeRegistry.declarationToGraphQLObjectType("subscription", subscriptions)
      }

      const schema = new GraphQLSchema(config)

      expressApp.use(
        properties.route || "/graphql",
        graphqlHTTP((request: any, response: any) => ({
          schema: schema,
          graphiql: true,
          context: {
            request,
            response,
          },
          customFormatErrorFn: (error: GraphQLError) => ({
            ...error,
            trace: process.env.NODE_ENV !== "production" ? error.stack : null
          })
        })),
      )

      // expressApp.use(/*serverOptions.graphqlSelectRequestsRoute || */"/graphql-select", (req, res) => {
      //   const selectionName = req.body.selectionName
      //   const variables = req.body.variables
      //   const variables = req.body.variables
      //
      //   res.json([])
      // })

      // setup playground
      if (properties.playground) {
        const expressPlayground = require('graphql-playground-middleware-express').default
        expressApp.get('/playground', expressPlayground({
          endpoint: properties.route || "/graphql",
          subscriptionsEndpoint: `ws://localhost:${properties.websocketPort}/${properties.subscriptionsRoute || "subscriptions"}`
        }))
      }

      // run websocket server
      if (properties.websocketPort) {

        const websocketServer = createServer((request, response) => {
          response.writeHead(404);
          response.end();
        })
        websocketServer.listen(properties.websocketPort, () => {})

        new SubscriptionServer(
          { schema, execute, subscribe },
          { server: websocketServer, path: '/' + (properties.subscriptionsRoute || "subscriptions") },
        );
      }
    }

    // register actions in the express
    for (let action of app.metadata.actions) {
      const name = action.name
      const type = name.substr(0, name.indexOf(" ")).toLowerCase()// todo: make sure to validate this before
      const route = name.substr(name.indexOf(" ") + 1).toLowerCase()
      // const metadata -


      const middlewares = (properties.actionMiddlewares && properties.actionMiddlewares[name]) ? properties.actionMiddlewares[name]() : []
      expressApp[type](route, ...middlewares, async (request: Request, response: Response, next: any) => {
        app.logger.resolveAction({
          app,
          route: route,
          method: type,
          request
        })
        try {
          // TODO: FIX TYPES OF PARAMS/QUERIES,ETC NOT BEING NORMALIZED BASED ON TYPE METADATA
          let actionResolverFn: ActionItemResolver<any, any> | undefined = undefined
          for (let resolver of resolvers) {
            if (resolver.type === "declaration-resolver") {
              if (resolver.declarationType === "any" || resolver.declarationType === "action") {
                if ((resolver.resolverFn as any)[name] !== undefined) {
                  actionResolverFn = (resolver.resolverFn as any)[name].bind(resolver.resolverFn) // (...args: any[]) => (resolver.resolverFn as any)[name](...args)
                }
              }
            } else if (resolver.type === "declaration-item-resolver") {
              if (resolver.declarationType === "any" || resolver.declarationType === "action") {
                if (resolver.name === name) {
                  actionResolverFn = resolver.resolverFn as ActionItemResolver<any, any>
                }
              }
            }
          }
          if (!actionResolverFn)
            throw new Error(`Action resolver ${name} was not found`)

          const context = await Utils.buildContext(resolvers, { request, response })
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
                app.logger.logActionResponse({
                  app,
                  route: route,
                  method: type,
                  content: result,
                  request
                })
                return result
              })
              .then(result => {
                if (action.return !== undefined)
                  response.json(result)
              })
              .catch(error => {
                app.logger.resolveActionError({
                  app,
                  route: route,
                  method: type,
                  error,
                  request
                })
                return properties.errorHandler!!.actionError({
                  app,
                  route: route,
                  method: type,
                  error,
                  request,
                  response
                })
              })
          } else {
            app.logger.logActionResponse({
              app,
              route: route,
              method: type,
              content: result,
              request
            })
            if (action.return !== undefined) {
              response.json(result)
            }
          } // think about text responses, status, etc.

        } catch (error) {
          app.logger.resolveActionError({
            app,
            route: route,
            method: type,
            error,
            request
          })
          return properties.errorHandler!!.actionError({
            app,
            route: route,
            method: type,
            error,
            request,
            response
          })
        }
      })
    }

    const server = expressApp.listen(properties.port)

    return () => new Promise<void>((ok, fail) => {
      server.close((err: any) => err ? fail(err) : ok())
    })
  }
}
