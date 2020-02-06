import {
  ActionItemResolver,
  AnyApplication,
  AnyApplicationOptions,
  Application,
  TypeMetadata
} from "@microframework/core";
import { ApplicationServer } from "@microframework/core";
import { parse } from "@microframework/parser";
import { Request, Response } from "express";
import * as fs from "fs"
import { execute, GraphQLError, GraphQLSchema, GraphQLSchemaConfig, subscribe } from "graphql";
import { createServer } from 'http';
import * as path from "path"
import { SubscriptionServer } from "subscriptions-transport-ws";
import { appEntitiesToTypeormEntities } from "./appEntitiesToTypeormEntities";
import { buildContext } from "./ContextBuilder";
import { DefaultServerOptions } from "./DefaultServerOptions";
import { generateEntityResolvers } from "./generateEntityResolvers";
import { TypeToGraphQLSchemaConverter } from "./TypeToGraphQLSchemaConverter";
import cors = require("cors");

const express = require("express")
const graphqlHTTP = require("express-graphql")

export const defaultServer = <Options extends AnyApplicationOptions>(
  app: Application<Options>,
  serverOptions: DefaultServerOptions<Options["context"]>
): ApplicationServer => {
  return async (/*options: AnyApplicationOptions*/) => {

    app.properties.pubsub = serverOptions.pubSub

    const tsFilePath = path.normalize(serverOptions.appPath + ".ts")
    const dtsFilePath = path.normalize(serverOptions.appPath + ".d.ts")

    if (fs.existsSync(tsFilePath)) {
      app.setMetadata(parse(tsFilePath))
    } else if (fs.existsSync(dtsFilePath)) {
      app.setMetadata(parse(dtsFilePath))
    } else {
      throw new Error(`${tsFilePath} or ${dtsFilePath} were not found!`)
    }


    if (app.properties.dataSourceFactory) {
      const connection = await app.properties.dataSourceFactory(appEntitiesToTypeormEntities(app, app.properties.entities))
      app.properties.dataSource = connection
    }


    const entityResolvers = generateEntityResolvers(app) /*{
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

    app.properties.resolvers.push(...entityResolvers.queryResolverSchema)
    app.properties.resolvers.push(...entityResolvers.mutationResolverSchema)
    app.properties.resolvers.push(...entityResolvers.subscriptionResolverSchema)

    // create and setup express server
    const expressApp = serverOptions.express || express()
    if (serverOptions.cors === true) {
      expressApp.use(cors())

    } else if (serverOptions.cors instanceof Object) {
      expressApp.use(cors(serverOptions.cors))
    }

    // setip graphql
    if (Object.keys(queries).length || Object.keys(mutations).length) {
      const typeRegistry = new TypeToGraphQLSchemaConverter({
        app,
        pubSub: serverOptions.pubSub
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
        serverOptions.route || "/graphql",
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
      if (serverOptions.playground) {
        const expressPlayground = require('graphql-playground-middleware-express').default
        expressApp.get('/playground', expressPlayground({
          endpoint: serverOptions.route || "/graphql",
          subscriptionsEndpoint: `ws://localhost:${serverOptions.websocketPort}/${serverOptions.subscriptionsRoute || "subscriptions"}`
        }))
      }

      // run websocket server
      if (serverOptions.websocketPort) {

        const websocketServer = createServer((request, response) => {
          response.writeHead(404);
          response.end();
        })
        websocketServer.listen(serverOptions.websocketPort, () => {})

        new SubscriptionServer(
          { schema, execute, subscribe },
          { server: websocketServer, path: '/' + (serverOptions.subscriptionsRoute || "subscriptions") },
        );
      }
    }

    // register actions in the express
    for (let action of app.metadata.actions) {
      const name = action.name
      const type = name.substr(0, name.indexOf(" ")).toLowerCase()// todo: make sure to validate this before
      const route = name.substr(name.indexOf(" ") + 1).toLowerCase()
      // const metadata -

      const middlewares = app.properties.actionMiddlewares[name] ? app.properties.actionMiddlewares[name]() : []
      expressApp[type](route, ...middlewares, async (request: Request, response: Response, next: any) => {
        app.properties.logger.resolveAction({
          app,
          route: route,
          method: type,
          request
        })
        try {
          // TODO: FIX TYPES OF PARAMS/QUERIES,ETC NOT BEING NORMALIZED BASED ON TYPE METADATA
          let actionResolverFn: ActionItemResolver<any, any> | undefined = undefined
          for (let resolver of app.properties.resolvers) {
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

          const context = await buildContext(app, { request, response })
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
                app.properties.logger.logActionResponse({
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
                app.properties.logger.resolveActionError({
                  app,
                  route: route,
                  method: type,
                  error,
                  request
                })
                return app.properties.errorHandler.actionError({
                  app,
                  route: route,
                  method: type,
                  error,
                  request,
                  response
                })
              })
          } else {
            app.properties.logger.logActionResponse({
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
          app.properties.logger.resolveActionError({
            app,
            route: route,
            method: type,
            error,
            request
          })
          return app.properties.errorHandler.actionError({
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

    const server = expressApp.listen(serverOptions.port)

    return () => new Promise<void>((ok, fail) => {
      server.close((err: any) => err ? fail(err) : ok())
    })
  }
}
