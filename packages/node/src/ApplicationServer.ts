import {
  AnyApplication,
  ApplicationLogger,
  ApplicationTypeMetadata,
  listOfTypeToArray,
  ResolverUtils,
} from "@microframework/core"
import { debugLogger } from "@microframework/logger"
import { defaultValidator } from "@microframework/validator"
import { Request, Response } from "express"
import { execute, GraphQLError, GraphQLSchema, subscribe } from "graphql"
import { Server as HttpServer } from "http"
import { SubscriptionServer } from "subscriptions-transport-ws"
import { ConnectionOptions } from "typeorm"
import { Server as WebsocketServer } from "ws"
import { ApplicationServerOptions } from "./ApplicationServerOptions"
import { ApplicationServerProperties } from "./ApplicationServerProperties"
import { ApplicationServerUtils } from "./ApplicationServerUtils"
import { DefaultErrorHandler } from "./error-handler"
import { GeneratedEntitySchemaBuilder } from "./GeneratedEntitySchemaBuilder"
import { GraphQLSchemaBuilder } from "./GraphQLSchemaBuilder"
import { LoggerHelper } from "./LoggerHelper"
import { DefaultNamingStrategy } from "./naming-strategy/DefaultNamingStrategy"
import { ResolverHelper } from "./ResolverHelper"
import { validateSchema } from "graphql"
import cors = require("cors")

const express = require("express")
const graphqlHTTP = require("express-graphql")

/**
 * Application server.
 */
export class ApplicationServer<App extends AnyApplication> {
  /**
   * Logger can be used to log application-level events.
   */
  logger: ApplicationLogger

  /**
   * Http server created on application start.
   */
  server?: HttpServer

  /**
   * Websocket server created on application start.
   */
  websocketServer?: WebsocketServer

  private app: App
  private subscriptionServer?: SubscriptionServer
  private properties: ApplicationServerProperties
  private resolverHelper: ResolverHelper
  private loggerHelper: LoggerHelper

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
    const resolvers = ResolverUtils.normalizeResolverMetadatas(
      options.resolvers,
    )
    this.app = app
    this.properties = {
      appPath: options.appPath,
      webserver: {
        express: options.webserver.express,
        port: options.webserver.port,
        cors: options.webserver.cors || false,
        staticDirs: options.webserver.staticDirs || {},
        middlewares: options.webserver.middlewares
          ? listOfTypeToArray(options.webserver.middlewares)
          : [],
        actionMiddlewares: options.webserver.actionMiddlewares || {},
      },
      graphql: {
        route: options.graphql?.route || "/graphql",
        graphiql: options.graphql?.graphiql || false,
        playground: options.graphql?.playground,
        options: options.graphql?.options,
      },
      websocket: {
        port: options.websocket?.port,
        host: options.websocket?.host || "ws://localhost",
        path: options.websocket?.path || "subscriptions",
        options: options.websocket?.options || {},
        pubSub: options.websocket?.pubSub,
        disconnectTimeout: options.websocket?.disconnectTimeout,
      },
      dataSourceFactory: options.dataSourceFactory,
      entities: options.entities,
      namingStrategy: DefaultNamingStrategy,
      errorHandler: DefaultErrorHandler,
      resolvers: resolvers,
      validationRules: options.validationRules
        ? listOfTypeToArray(options.validationRules)
        : [],
      generateModelRootQueries: options.generateModelRootQueries || false,
      maxGeneratedConditionsDeepness:
        options.maxGeneratedConditionsDeepness !== undefined
          ? options.maxGeneratedConditionsDeepness
          : 5,
      validator: options.validator || defaultValidator,
      logger: options.logger || debugLogger,
      rateLimits: options.rateLimits,
      rateLimitConstructor: options.rateLimitConstructor,
    }
    this.loggerHelper = new LoggerHelper(this.properties.logger)
    this.resolverHelper = new ResolverHelper(this.loggerHelper, this.properties)
    this.logger = this.loggerHelper.createApplicationLogger()
  }

  /**
   * Starts application server.
   * Runs express server, websocket server, setups database connection, etc.
   */
  async start(): Promise<this> {
    // load application metadata
    this.metadata = await ApplicationServerUtils.loadAppMetadata(
      this.properties.appPath,
    )

    // setup a database connection
    await this.loadDataSource()

    // generate additional root definitions / resolvers for root models
    if (
      this.properties.dataSource &&
      this.properties.generateModelRootQueries
    ) {
      const generator = new GeneratedEntitySchemaBuilder(
        this.metadata,
        this.properties,
      )
      generator.generate()
    }

    // create and setup express server
    const expressApp = this.properties.webserver.express || express()

    // apply middlewares
    this.properties.webserver.middlewares.forEach((middleware) =>
      expressApp.use(middleware),
    )

    // setup CORS
    if (this.properties.webserver.cors) {
      const corsMiddleware =
        typeof this.properties.webserver.cors === "object"
          ? cors(this.properties.webserver.cors)
          : cors()
      expressApp.use(corsMiddleware)
    }

    // setup GraphQL
    let schema: GraphQLSchema | undefined = undefined
    const typeRegistry = new GraphQLSchemaBuilder(
      this.loggerHelper,
      this.metadata,
      this.properties,
    )
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
        const route =
          typeof this.properties.graphql.playground === "string"
            ? this.properties.graphql.playground
            : "/playground"
        expressApp.get(route, this.createPlaygroundMiddleware())
      }
    }

    // setup websocket server
    if (this.properties.websocket.port) {
      this.createWebsocketServer(schema)
    }

    // register action routes in express app
    for (let action of this.metadata.actions) {
      const method = action.name
        .substr(0, action.name.indexOf(" "))
        .toLowerCase() // todo: make sure to validate this before
      const route = action.name.substr(action.name.indexOf(" ") + 1)
      if (!method || !route)
        throw new Error(
          `Invalid action defined "${action.name}". Action name must contain HTTP method (e.g. "get", "post", ...) and URL (e.g. "/users", ...).`,
        )

      const middlewares =
        this.properties.webserver.actionMiddlewares[action.name] || []
      expressApp[method](
        route,
        ...middlewares,
        async (request: Request, response: Response, _next: any) => {
          this.resolverHelper.createActionResolver(request, response, action)
        },
      )
    }

    // register static directories
    if (this.properties.webserver.staticDirs) {
      for (let route in this.properties.webserver.staticDirs) {
        expressApp.use(
          route,
          express.static(this.properties.webserver.staticDirs[route]),
        )
      }
    }

    // launch the server
    this.server = expressApp.listen(this.properties.webserver.port)

    return this
  }

  /**
   * Completely stops the application server.
   */
  async stop(): Promise<this> {
    await new Promise<void>((ok, fail) => {
      if (!this.server) return ok()
      this.server.close((err: any) => (err ? fail(err) : ok()))
    })

    await new Promise<void>((ok, fail) => {
      if (!this.websocketServer) return ok()
      this.websocketServer.close((err: any) => (err ? fail(err) : ok()))
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
          mappedEntitySchemaProperties: ApplicationServerUtils.modelsToApp(
            this.metadata.models,
          ),
        })
      }
      if (this.properties.entities) {
        Object.assign(dataSourceOptions, {
          entities: this.properties.entities,
        })
      }
      this.properties.dataSource = await this.properties.dataSourceFactory(
        dataSourceOptions,
      )
    }
  }

  /**
   * Middleware for GraphQL.
   */
  private createGraphQLMiddleware(schema: GraphQLSchema) {

    // make sure schema is valid
    const errors = validateSchema(schema)
    if (errors.length) {
      throw new Error(errors.toString())
    }

    // create a graphql HTTP server
    return graphqlHTTP((request: any, response: any) => ({
      schema: schema,
      graphiql: this.properties.graphql.graphiql || false,
      context: {
        request,
        response,
      },
      customFormatErrorFn: (error: GraphQLError) => {
        return {
          ...error,
          // trace: process.env.NODE_ENV !== "production" ? error.stack : null,
          code: (error.originalError as Error & { code?: number })?.code,
          stack: error.stack ? error.stack.split("\n") : [],
          path: error.path,
        }
      },
      ...(this.properties.graphql.options || {}),
    }))
  }

  /**
   * Middleware for express playground.
   */
  private createPlaygroundMiddleware() {
    const expressPlayground = require("graphql-playground-middleware-express")
      .default
    const endpoint = `${this.properties.websocket.host}:${this.properties.websocket.port}/${this.properties.websocket.path}`
    return expressPlayground({
      endpoint: this.properties.graphql.route,
      subscriptionsEndpoint: endpoint,
    })
  }

  /**
   * Creates a websocket server.
   */
  private createWebsocketServer(schema?: GraphQLSchema) {
    this.websocketServer = new WebsocketServer({
      port: this.properties.websocket.port,
      path: "/" + this.properties.websocket.path,
      ...this.properties.websocket.options,
    })

    // setup a disconnection timeout to know when websocket user is disconnected
    // https://github.com/websockets/ws#how-to-detect-and-close-broken-connections
    if (this.properties.websocket.disconnectTimeout) {
      this.websocketServer!!.on("connection", (ws) => {
        ;(ws as any)["isAlive"] = true
        ws.on("pong", () => {
          ;(ws as any)["isAlive"] = true
        })
      })

      const interval = setInterval(() => {
        this.websocketServer!.clients.forEach((ws) => {
          if ((ws as any)["isAlive"] === false) return ws.terminate()
          ;(ws as any)["isAlive"] = false
          ws.ping(function () {})
        })
      }, this.properties.websocket.disconnectTimeout)

      this.websocketServer!!.on("close", function close() {
        clearInterval(interval)
      })
    }

    if (schema) {
      this.subscriptionServer = new SubscriptionServer(
        { schema, execute, subscribe },
        this.websocketServer,
      )
    }
  }
}

/**
 * Creates a new server.
 */
export const createApplicationServer = <App extends AnyApplication>(
  app: App,
  options: ApplicationServerOptions,
): ApplicationServer<App> => new ApplicationServer(app, options)
