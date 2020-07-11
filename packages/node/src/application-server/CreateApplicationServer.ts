import {
  AnyApplication,
  ApplicationTypeMetadata,
  assign,
} from "@microframework/core"
import cors from "cors"
import express, { Request, Response } from "express"
import { graphqlHTTP } from "express-graphql"
import * as aaa from "express-graphql"
import {
  assertValidSchema,
  execute,
  GraphQLError,
  GraphQLSchema,
  subscribe,
} from "graphql"
import { SubscriptionServer } from "subscriptions-transport-ws"
import { ConnectionOptions } from "typeorm"
import { Server as WebsocketServer } from "ws"
import {
  GeneratedEntitySchemaBuilder,
  GraphQLSchemaBuilder,
  LoggerHelper,
  ResolverHelper,
} from ".."
import { ApplicationServer } from "./ApplicationServer"
import { ApplicationServerOptions } from "./ApplicationServerOptions"
import { ApplicationServerUtils } from "./ApplicationServerUtils"

/**
 * Creates a new server.
 */
export function createApplicationServer<App extends AnyApplication>(
  app: App,
  options: ApplicationServerOptions,
): ApplicationServer<App> {
  // -- private properties --
  let subscriptionServer: SubscriptionServer | undefined = undefined
  const properties = ApplicationServerUtils.optionsToProperties(options)
  const loggerHelper = new LoggerHelper(properties.logger)
  const resolverHelper = new ResolverHelper(loggerHelper, properties)
  const logger = loggerHelper.createApplicationLogger()

  // -- private functions --
  // create and setup express server
  const expressApp = properties.webserver.express || express()

  /**
   * Setups a database source (TypeORM's connection).
   */
  const loadDataSource = async (
    metadata: ApplicationTypeMetadata,
  ): Promise<void> => {
    if (!properties.dataSourceFactory) return

    const dataSourceOptions: Partial<ConnectionOptions> = {}
    if (metadata && metadata.models.length > 0) {
      assign(dataSourceOptions, {
        mappedEntitySchemaProperties: ApplicationServerUtils.modelsToApp(
          metadata.models,
        ),
      })
    }
    if (properties.entities) {
      assign(dataSourceOptions, {
        entities: properties.entities,
      })
    }
    assign(properties, {
      dataSource: await properties.dataSourceFactory(dataSourceOptions),
    })
  }

  /**
   * Creates a GraphQL middleware for Express server.
   */
  const createGraphQLMiddleware = (schema: GraphQLSchema) => {
    // create a graphql HTTP server
    console.log(aaa)
    console.log(graphqlHTTP)
    return graphqlHTTP((request, response) => ({
      schema: schema,
      graphiql: properties.graphql.graphiql || false,
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
      ...(properties.graphql.options || {}),
    }))
  }

  /**
   * Middleware for express playground.
   */
  const createPlaygroundMiddleware = () => {
    const expressPlayground = require("graphql-playground-middleware-express")
      .default
    const endpoint = `${properties.websocket.host}:${properties.websocket.port}/${properties.websocket.path}`
    return expressPlayground({
      endpoint: properties.graphql.route,
      subscriptionsEndpoint: endpoint,
    })
  }

  /**
   * Creates a websocket server.
   */
  const createWebsocketServer = (schema?: GraphQLSchema) => {
    let websocketServer = new WebsocketServer({
      port: properties.websocket.port,
      path: "/" + properties.websocket.path,
      ...properties.websocket.options,
    })

    // setup a disconnection timeout to know when websocket user is disconnected
    // https://github.com/websockets/ws#how-to-detect-and-close-broken-connections
    if (properties.websocket.disconnectTimeout) {
      websocketServer!!.on("connection", (ws) => {
        ;(ws as any)["isAlive"] = true
        ws.on("pong", () => {
          ;(ws as any)["isAlive"] = true
        })
      })

      const interval = setInterval(() => {
        websocketServer!.clients.forEach((ws) => {
          if ((ws as any)["isAlive"] === false) return ws.terminate()
          ;(ws as any)["isAlive"] = false
          ws.ping(function () {})
        })
      }, properties.websocket.disconnectTimeout)

      websocketServer!!.on("close", function close() {
        clearInterval(interval)
      })
    }

    if (schema) {
      subscriptionServer = new SubscriptionServer(
        { schema, execute, subscribe },
        websocketServer,
      )
    }

    return websocketServer
  }

  // -- returned type --
  return {
    typeof: "ApplicationServer",
    express: expressApp,
    properties: properties,
    logger: logger,
    // properties: properties,
    server: undefined,
    websocketServer: undefined,
    metadata: {
      name: "",
      actions: [],
      inputs: [],
      models: [],
      mutations: [],
      queries: [],
      subscriptions: [],
    },

    /**
     * Starts application server.
     * Runs express server, websocket server, setups database connection, etc.
     */
    async start() {
      // load application metadata
      const metadata = await ApplicationServerUtils.loadAppMetadata(
        properties.appPath,
      )
      assign(this, { metadata })

      // setup a database connection
      await loadDataSource(this.metadata)

      // generate additional root definitions / resolvers for root models
      if (properties.dataSource && properties.generateModelRootQueries) {
        const generator = new GeneratedEntitySchemaBuilder(
          this.metadata!,
          properties,
        )
        generator.generate()
      }

      // apply middlewares
      properties.webserver.middlewares.forEach((middleware) =>
        expressApp.use(middleware),
      )

      // setup CORS
      if (properties.webserver.cors) {
        const corsMiddleware =
          typeof properties.webserver.cors === "object"
            ? cors(properties.webserver.cors)
            : cors()
        expressApp.use(corsMiddleware)
      }

      // setup GraphQL
      let schema: GraphQLSchema | undefined = undefined
      const typeRegistry = new GraphQLSchemaBuilder(
        loggerHelper,
        metadata!,
        properties,
      )
      if (typeRegistry.canHaveSchema()) {
        // create a GraphQL schema
        schema = typeRegistry.build()

        // make sure schema is valid
        assertValidSchema(schema)

        // setup a GraphQL route
        expressApp.use(
          properties.graphql.route,
          createGraphQLMiddleware(schema),
        )

        // setup a GraphQL playground
        if (properties.graphql.playground) {
          const route =
            typeof properties.graphql.playground === "string"
              ? properties.graphql.playground
              : "/playground"
          expressApp.get(route, createPlaygroundMiddleware())
        }
      }

      // setup websocket server
      if (properties.websocket.port) {
        const websocketServer = createWebsocketServer(schema)
        assign(this, { websocketServer } as Partial<ApplicationServer<any>>)
      }

      // register action routes in express app
      for (let action of this.metadata!.actions) {
        const method = action.name
          .substr(0, action.name.indexOf(" "))
          .toLowerCase() // todo: make sure to validate this before
        const route = action.name.substr(action.name.indexOf(" ") + 1)
        if (!method || !route) {
          throw new Error(
            `Invalid action defined "${action.name}". Action name must contain HTTP method (e.g. "get", "post", ...) and URL (e.g. "/users", ...).`,
          )
        }

        const middlewares = properties.webserver.actionMiddleware[action.name]
        ;(expressApp as any)[method](
          route,
          ...(middlewares || []),
          async (request: Request, response: Response, _next: any) => {
            resolverHelper.createActionResolver(request, response, action)
          },
        )
      }

      // register static directories
      if (properties.webserver.staticDirs) {
        for (let route in properties.webserver.staticDirs) {
          expressApp.use(
            route,
            express.static(properties.webserver.staticDirs[route]),
          )
        }
      }

      // launch the server
      const server = expressApp.listen(properties.webserver.port)
      assign(this, { server })

      return this
    },

    /**
     * Completely stops the application server.
     */
    async stop() {
      await new Promise<void>((ok, fail) => {
        if (!this.server) return ok()
        this.server.close((err: any) => (err ? fail(err) : ok()))
      })

      await new Promise<void>((ok, fail) => {
        if (!this.websocketServer) return ok()
        this.websocketServer.close((err: any) => (err ? fail(err) : ok()))
      })

      await new Promise<void>((ok, fail) => {
        if (!subscriptionServer) return ok()
        try {
          subscriptionServer.close()
          ok()
        } catch (err) {
          fail(err)
        }
      })

      return this
    },
  }
}
