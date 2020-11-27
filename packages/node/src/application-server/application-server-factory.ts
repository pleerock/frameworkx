import { AnyApplication, assign } from "@microframework/core"
import { buildGraphQLSchema } from "@microframework/graphql"
import cors from "cors"
import express, { Request, Response } from "express"
import { execute, GraphQLSchema, subscribe } from "graphql"
import { SubscriptionServer } from "subscriptions-transport-ws"
import { generateEntityResolvers, ResolverHelper } from ".."
import { ApplicationServer } from "./application-server-type"
import { ApplicationServerOptions } from "./application-server-options-type"
import { ApplicationServerUtils } from "./application-server-utils"
import { generateSwaggerDocumentation } from "../swagger-generator"
import { LoggerUtils } from "../util/logger-utils"

/**
 * Creates a new server.
 */
export function createApplicationServer<App extends AnyApplication>(
  app: App,
  options: ApplicationServerOptions,
): ApplicationServer<App> {
  // ----------------------
  let subscriptionServer: SubscriptionServer | undefined = undefined
  let schema: GraphQLSchema | undefined = undefined
  const properties = ApplicationServerUtils.optionsToProperties(options)
  const logger = LoggerUtils.createApplicationLogger(properties.logger)
  const expressApp = properties.webserver.express || express()

  return {
    "@type": "ApplicationServer",
    express: expressApp,
    properties: properties,
    logger: logger,
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
        const dataSource = await ApplicationServerUtils.loadDataSource(
          this.metadata,
          this.properties.dataSource,
          this.properties.entities,
        )
        assign(this, { dataSource } as Partial<ApplicationServer<any>>)
      }

      // generate additional root definitions / resolvers for root models
      if (this.dataSource && properties.generateModelRootQueries) {
        generateEntityResolvers(this.metadata!, properties, this.dataSource)
      }

      // apply middlewares
      for (let middleware of properties.webserver.middlewares) {
        expressApp.use(middleware)
      }

      // setup CORS middleware
      if (properties.webserver.cors) {
        const corsMiddleware =
          typeof properties.webserver.cors === "object"
            ? cors(properties.webserver.cors)
            : cors()
        expressApp.use(corsMiddleware)
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

      const resolverHelper = new ResolverHelper(properties, this.dataSource)

      // setup GraphQL
      if (
        Object.keys(metadata.queries).length > 0 ||
        Object.keys(metadata.mutations).length > 0 ||
        Object.keys(metadata.subscriptions).length > 0
      ) {
        schema = buildGraphQLSchema({
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
          ApplicationServerUtils.createGraphQLMiddleware(
            schema,
            properties.graphql.graphiql || false,
            properties.graphql.options || {},
          ),
        )

        // setup a GraphQL playground
        if (properties.graphql.playground) {
          const playgroundRoute =
            typeof properties.graphql.playground === "string"
              ? properties.graphql.playground
              : "/playground"
          const subscriptionsEndpoint = `ws://${properties.websocket.host}:${properties.websocket.port}/${properties.websocket.path}`
          expressApp.get(
            playgroundRoute,
            ApplicationServerUtils.createPlaygroundMiddleware(
              properties.graphql.route,
              subscriptionsEndpoint,
            ),
          )
        }
      }

      // setup websocket server
      if (properties.websocket.port) {
        const websocketServer = ApplicationServerUtils.createWebsocketServer(
          properties.websocket,
        )
        if (schema) {
          subscriptionServer = new SubscriptionServer(
            { schema, execute, subscribe },
            websocketServer,
          )
        }
        assign(this, { websocketServer } as Partial<ApplicationServer<any>>)
      }

      // register action routes in express app
      for (let action of this.metadata!.actions) {
        let [method, ...paths] = (action.name as string).split(" ")
        const route = paths.join(" ")

        if (!method || !route) {
          throw new Error(
            `Invalid action defined "${action.name}". Action name must contain HTTP method (e.g. "get", "post", ...) and URL (e.g. "/users", ...).`,
          )
        }
        if (!(expressApp as any)[method.toLowerCase()]) {
          throw new Error(
            `Invalid action name "${action.name}", method "${method}" isn't supported.`,
          )
        }

        ;(expressApp as any)[method.toLowerCase()](
          route,
          ...(properties.webserver.actionMiddleware[action.name] || []),
          async (request: Request, response: Response, _next: any) => {
            resolverHelper.createActionResolver(request, response, action)
          },
        )
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
              generateSwaggerDocumentation(metadata),
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
