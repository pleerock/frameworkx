import {AnyApplicationOptions, Application, ModelResolverSchema} from "@microframework/core";
import {AnyApplication} from "@microframework/core";
import {ActionResolverFn, SubscriptionResolverFn} from "@microframework/core";
import {TypeMetadata} from "@microframework/core/_";
import {parse} from "@microframework/parser";
import {Request, Response} from "express";
import {GraphQLError, GraphQLSchema, GraphQLSchemaConfig} from "graphql";
import {withFilter} from "graphql-subscriptions";
import {SubscriptionServer} from "subscriptions-transport-ws";
import { execute, subscribe } from 'graphql';
import { createServer } from 'http';
import {appEntitiesToTypeormEntities} from "./appEntitiesToTypeormEntities";
import {DefaultServerOptions} from "./DefaultServerOptions";
import {generateEntityResolvers} from "./generateEntityResolvers";
import {GraphQLResolver, TypeToGraphQLSchemaConverter} from "./TypeToGraphQLSchemaConverter";
import cors = require("cors");
import * as path from "path"
import * as fs from "fs"

const express = require("express")
const graphqlHTTP = require("express-graphql")

export const defaultServer = <Options extends AnyApplicationOptions>(
  app: Application<Options>,
  serverOptions: DefaultServerOptions<Options["context"]>
) => {
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
      const manager = app.action(action.name)
      const middlewares = app.properties.actionMiddlewares[manager.name] ? app.properties.actionMiddlewares[manager.name]() : []
      expressApp[manager.type](manager.route, ...middlewares, async (request: Request, response: Response, next: any) => {
        app.properties.logger.resolveAction({
          app,
          route: manager.route,
          method: manager.type,
          request
        })
        try {
          const resolver = app.properties.resolvers.find(resolver => resolver.type === "action" && resolver.name === manager.name)
          const context = await resolveContextOptions(app, { request, response })
          const result = (resolver!.resolverFn as ActionResolverFn<any, any>)({
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
                  route: manager.route,
                  method: manager.type,
                  content: result,
                  request
                })
                return result
              })
              .then(result => {
                if (manager.metadata.return !== undefined)
                  response.json(result)
              })
              .catch(error => {
                app.properties.logger.resolveActionError({
                  app,
                  route: manager.route,
                  method: manager.type,
                  error,
                  request
                })
                return app.properties.errorHandler.actionError({
                  app,
                  route: manager.route,
                  method: manager.type,
                  error,
                  request,
                  response
                })
              })
          } else {
            app.properties.logger.logActionResponse({
              app,
              route: manager.route,
              method: manager.type,
              content: result,
              request
            })
            if (manager.metadata.return !== undefined) {
              response.json(result)
            }
          } // think about text responses, status, etc.

        } catch (error) {
          app.properties.logger.resolveActionError({
            app,
            route: manager.route,
            method: manager.type,
            error,
            request
          })
          return app.properties.errorHandler.actionError({
            app,
            route: manager.route,
            method: manager.type,
            error,
            request,
            response
          })
        }
      })
    }

    expressApp.listen(serverOptions.port)
  }
}

/**
 * Resolves context value.
 */
async function resolveContextOptions(app: AnyApplication, options: { request: Request, response: Response }) {
  let resolvedContext: any = {
    // we can define default framework context variables here
    request: options.request,
    response: options.response,
  }
  for (const key in app.properties.context) {
    const contextResolverItem = app.properties.context[key]
    let result = contextResolverItem instanceof Function ? contextResolverItem(options) : contextResolverItem
    if (result instanceof Promise) {
      result = await result
    }
    resolvedContext[key] = result
  }
  return resolvedContext
}
