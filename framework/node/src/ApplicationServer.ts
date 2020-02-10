import { AnyApplication, ApplicationTypeMetadata, listOfTypeToArray, ResolverUtils } from "@microframework/core";
import { debugLogger } from "@microframework/logger"
import { defaultValidator } from "@microframework/validator"
import { Request, Response } from "express";
import { execute, GraphQLError, GraphQLSchema, subscribe } from "graphql";
import { createServer, Server as HttpServer } from 'http';
import { SubscriptionServer } from "subscriptions-transport-ws";
import { ConnectionOptions } from "typeorm";
import { ApplicationServerOptions } from "./ApplicationServerOptions";
import { ApplicationServerProperties } from "./ApplicationServerProperties";
import { ApplicationServerUtils } from "./ApplicationServerUtils";
import { DefaultErrorHandler } from "./error-handler";
import { GeneratedEntitySchemaBuilder } from "./GeneratedEntitySchemaBuilder";
import { GraphQLSchemaBuilder } from "./GraphQLSchemaBuilder";
import { DefaultNamingStrategy } from "./naming-strategy/DefaultNamingStrategy";
import { ResolverHelper } from "./ResolverHelper";
import cors = require("cors");

const express = require("express")
const graphqlHTTP = require("express-graphql")

/**
 * Application server.
 */
export class ApplicationServer<App extends AnyApplication> {

  private app: App
  private server?: HttpServer
  private websocketServer?: HttpServer
  private subscriptionServer?: SubscriptionServer
  private properties: ApplicationServerProperties
  private resolverHelper: ResolverHelper

  /**
   * Application types metadata.
   */
  private metadata: ApplicationTypeMetadata = {
    name: "",
    actions: [],
    inputs: [],
    models: [],
    mutations: [],
    queries: [],
    subscriptions: [],
  }

  constructor(app: App, options: ApplicationServerOptions) {
    const resolvers = ResolverUtils.normalizeResolverMetadatas(options.resolvers)
    this.app = app
    this.properties = {
      appPath: options.appPath,
      express: options.express,
      port: options.port,
      cors: options.cors || false,
      staticDirs: options.staticDirs || {},
      middlewares: options.middlewares ? listOfTypeToArray(options.middlewares) : [],
      actionMiddlewares: options.actionMiddlewares || {},
      graphql: {
        route: options.graphql?.route || "/graphql",
        graphiql: options.graphql?.graphiql || false,
        playground: options.graphql?.playground || false,
        options: options.graphql?.options
      },
      websocket: {
        port: options.websocket?.port,
        host: options.websocket?.host || "ws://localhost",
        path: options.websocket?.path || "subscriptions",
        options: options.websocket?.options || {},
      },
      dataSourceFactory: options.dataSourceFactory,
      entities: options.entities,
      namingStrategy: DefaultNamingStrategy,
      errorHandler: DefaultErrorHandler,
      resolvers: resolvers,
      validationRules: options.validationRules ? listOfTypeToArray(options.validationRules) : [],
      generateModelRootQueries: options.generateModelRootQueries || false,
      maxGeneratedConditionsDeepness: options.maxGeneratedConditionsDeepness !== undefined ? options.maxGeneratedConditionsDeepness : 5,
      validator: options.validator || defaultValidator,
      logger: options.logger || debugLogger,
    }
    this.resolverHelper = new ResolverHelper(this.properties)
  }

  /**
   * Starts application server.
   * Runs express server, websocket server, setups database connection, etc.
   */
  async start(): Promise<this> {

    // load application metadata
    this.metadata = await ApplicationServerUtils.loadAppMetadata(this.properties.appPath)

    // setup a database connection
    await this.loadDataSource()

    // generate additional root definitions / resolvers for root models
    if (this.properties.dataSource && this.properties.generateModelRootQueries) {
      const generator = new GeneratedEntitySchemaBuilder(this.metadata, this.properties)
      generator.generate()
    }

    // create and setup express server
    const expressApp = this.properties.express || express()

    // apply middlewares
    this.properties.middlewares.forEach(middleware => expressApp.use(middleware))

    // setup CORS
    if (this.properties.cors) {
      const corsMiddleware = typeof this.properties.cors === "object" ? cors(this.properties.cors) : cors()
      expressApp.use(corsMiddleware)
    }

    // setup GraphQL
    let schema: GraphQLSchema | undefined = undefined
    const typeRegistry = new GraphQLSchemaBuilder(this.metadata, this.properties)
    if (typeRegistry.canHaveSchema()) {

      // create a GraphQL schema
      schema = typeRegistry.build()

      // setup a GraphQL route
      expressApp.use(
          this.properties.graphql.route,
          this.createGraphQLMiddleware(schema),
      )

      // setup a GraphQL playground
      if (this.properties.graphql.playground) {
        const route = typeof this.properties.graphql.playground === "string" ? this.properties.graphql.playground : "/playground"
        expressApp.get(route, this.createPlaygroundMiddleware())
      }
    }

    // setup websocket server
    if (this.properties.websocket.port) {
      this.createWebsocketServer(schema)
    }

    // register action routes in express app
    for (let action of this.metadata.actions) {
      const method = action.name.substr(0, action.name.indexOf(" ")).toLowerCase() // todo: make sure to validate this before
      const route = action.name.substr(action.name.indexOf(" ") + 1).toLowerCase()
      if (!method || !route)
        throw new Error(`Invalid action defined "${action.name}". Action name must contain HTTP method (e.g. "get", "post", ...) and URL (e.g. "/users", ...).`)

      const middlewares = this.properties.actionMiddlewares[action.name] || []
      expressApp[method](route, ...middlewares, async (request: Request, response: Response, _next: any) => {
        this.resolverHelper.createActionResolver({ method, route, request, response }, action)
      })
    }

    // register static directories
    if (this.properties.staticDirs) {
      for (let route in this.properties.staticDirs) {
        expressApp.use(route, express.static(this.properties.staticDirs[route]))
      }
    }

    // launch the server
    this.server = expressApp.listen(this.properties.port)

    return this
  }

  /**
   * Completely stops the application server.
   */
  async stop(): Promise<this> {

    await new Promise<void>((ok, fail) => {
      if (!this.server) return ok()
      this.server.close((err: any) => err ? fail(err) : ok())
    })

    await new Promise<void>((ok, fail) => {
      if (!this.websocketServer) return ok()
      this.websocketServer.close((err: any) => err ? fail(err) : ok())
    })

    await new Promise<void>((ok, fail) => {
      if (!this.subscriptionServer) return ok()
      try {
        this.subscriptionServer.close()
        ok()
      } catch (err) {
        fail(err)
      }
    })

    return this
  }

  /**
   * Setups a database source (TypeORM's connection).
   */
  private async loadDataSource() {
    if (this.properties.dataSourceFactory) {
      const dataSourceOptions: Partial<ConnectionOptions> = {}
      if (this.metadata.models.length > 0) {
        Object.assign(dataSourceOptions, {
          mappedEntitySchemaProperties: ApplicationServerUtils.modelsToApp(this.metadata.models)
        })
      }
      if (this.properties.entities) {
        Object.assign(dataSourceOptions, {
          entities: this.properties.entities
        })
      }
      this.properties.dataSource = await this.properties.dataSourceFactory(dataSourceOptions)
    }
  }

  /**
   * Middleware for GraphQL.
   */
  private createGraphQLMiddleware(schema: GraphQLSchema) {
    return graphqlHTTP((request: any, response: any) => ({
      schema: schema,
      graphiql: this.properties.graphql.graphiql || false,
      context: {
        request,
        response,
      },
      customFormatErrorFn: (error: GraphQLError) => ({
        ...error,
        trace: process.env.NODE_ENV !== "production" ? error.stack : null
      }),
      ...(this.properties.graphql.options || {})
    }))
  }

  /**
   * Middleware for express playground.
   */
  private createPlaygroundMiddleware() {
    const expressPlayground = require('graphql-playground-middleware-express').default
    const endpoint = `${this.properties.websocket.host}:${this.properties.websocket.port}/${this.properties.websocket.path}`
    return expressPlayground({
      endpoint: this.properties.graphql.route,
      subscriptionsEndpoint: endpoint
    })
  }

  /**
   * Creates a websocket server.
   */
  private createWebsocketServer(schema?: GraphQLSchema) {
    this.websocketServer = createServer((request, response) => {
      response.writeHead(404);
      response.end();
    })
    this.websocketServer.listen(this.properties.websocket.port, () => {})

    if (schema) {
      this.subscriptionServer = new SubscriptionServer(
          { schema, execute, subscribe },
          {
            server: this.websocketServer,
            path: this.properties.websocket.path,
            ...this.properties.websocket.options
          },
      )
    }
  }

}

/**
 * Creates a new server.
 */
export const createApplicationServer = <App extends AnyApplication>(
  app: App,
  options: ApplicationServerOptions
): ApplicationServer<App> => new ApplicationServer(app, options)
