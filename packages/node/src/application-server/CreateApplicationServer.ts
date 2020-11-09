import {
  AnyApplication,
  ApplicationTypeMetadata,
  assign,
} from "@microframework/core"
import { LoggerHelper } from "@microframework/logger"
import { buildGraphQLSchema } from "@microframework/graphql"
import cors from "cors"
import express, { Request, Response } from "express"
import { graphqlHTTP } from "express-graphql"
import { execute, GraphQLError, GraphQLSchema, subscribe } from "graphql"
import { SubscriptionServer } from "subscriptions-transport-ws"
import { Connection, ConnectionOptions } from "typeorm"
import { Server as WebsocketServer } from "ws"
import { GeneratedEntitySchemaBuilder, ResolverHelper } from ".."
import { ApplicationServer } from "./ApplicationServer"
import { ApplicationServerOptions } from "./ApplicationServerOptions"
import { ApplicationServerUtils } from "./ApplicationServerUtils"
import { generateSwaggerDocumentation } from "../swagger-generator"

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
  const logger = loggerHelper.createApplicationLogger()

  // -- private functions --
  // create and setup express server
  const expressApp = properties.webserver.express || express()

  /**
   * Setups a database source (TypeORM's connection).
   */
  const loadDataSource = async (
    metadata: ApplicationTypeMetadata,
  ): Promise<Connection> => {
    // as usual, we can't rely on "instanceof", so let's just check if its a Connection object
    // until we have "@type" property in the next TypeORM version
    if (
      (properties.dataSource as Connection)["name"] &&
      (properties.dataSource as Connection)["options"]
    ) {
      return properties.dataSource as Connection
    }
    if (typeof properties.dataSource === "function") {
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
      return properties.dataSource(dataSourceOptions)
    }

    throw new Error("Data source was not set in app options.")
  }

  /**
   * Creates a GraphQL middleware for Express server.
   */
  const createGraphQLMiddleware = (schema: GraphQLSchema) => {
    // create a graphql HTTP server
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
    const endpoint = `ws://${properties.websocket.host}:${properties.websocket.port}/${properties.websocket.path}`
    return expressPlayground({
      endpoint: properties.graphql.route,
      subscriptionsEndpoint: endpoint,
    })
  }

  /**
   * Creates a websocket server.
   */
  const createWebsocketServer = (schema?: GraphQLSchema) => {
    const wsServer: typeof WebsocketServer =
      properties.websocket.websocketServer || WebsocketServer
    let websocketServer = new wsServer({
      host: properties.websocket.host,
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
    "@type": "ApplicationServer",
    express: expressApp,
    properties: properties,
    logger: logger,
    // properties: properties,
    server: undefined,
    websocketServer: undefined,
    dataSource: undefined,
    metadata: {
      "@type": "ApplicationTypeMetadata",
      name: "",
      description: "",
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
      if (this.properties.dataSource) {
        const dataSource = await loadDataSource(this.metadata)
        assign(this, { dataSource } as Partial<ApplicationServer<any>>)
      }

      // generate additional root definitions / resolvers for root models
      if (this.dataSource && properties.generateModelRootQueries) {
        const generator = new GeneratedEntitySchemaBuilder(
          this.metadata!,
          properties,
          this.dataSource,
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

      const resolverHelper = new ResolverHelper(
        loggerHelper,
        properties,
        this.dataSource,
      )

      // setup GraphQL
      if (
        Object.keys(metadata.queries).length > 0 ||
        Object.keys(metadata.mutations).length > 0 ||
        Object.keys(metadata.subscriptions).length > 0
      ) {
        const schema = buildGraphQLSchema({
          assert: true,
          appMetadata: metadata!,
          namingStrategy: this.properties.namingStrategy.graphqlSchema,
          resolveFactory: resolverHelper.createRootDeclarationResolverFn.bind(
            resolverHelper,
          ) as any,
          subscribeFactory: resolverHelper.createRootSubscriptionResolver.bind(
            resolverHelper,
          ) as any,
        })

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

        // setup websocket server
        if (properties.websocket.port) {
          const websocketServer = createWebsocketServer(schema)
          assign(this, { websocketServer } as Partial<ApplicationServer<any>>)
        }
      }

      // register action routes in express app
      for (let action of this.metadata!.actions) {
        // todo: duplicate, extract into utils
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

      // setup swagger
      if (properties.swagger) {
        const swaggerUi = require("swagger-ui-express")
        // console.log(
        //   JSON.stringify(generateSwaggerDocumentation(this.metadata!), null, 2),
        // )
        expressApp.use(
          properties.swagger.route,
          swaggerUi.serve,
          swaggerUi.setup(
            Object.assign(
              generateSwaggerDocumentation(this.metadata!),
              properties.swagger.document || {},
            ),
          ),
        )
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
        this.websocketServer.close((err: any) => {
          err ? fail(err) : ok()
          // console.log("closed connection with websocket server")
        })
      })

      await new Promise<void>((ok, fail) => {
        if (!subscriptionServer) return ok()
        try {
          subscriptionServer.close()
          // console.log("closed connection with subscription server")
          ok()
        } catch (err) {
          fail(err)
        }
      })

      return this
    },
  }
}
