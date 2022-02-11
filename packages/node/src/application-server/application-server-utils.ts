import {
  ApplicationTypeMetadata,
  ApplicationUtils,
  MixedList,
} from "@microframework/core"
import { debugLogger } from "@microframework/logger"
import { parse } from "@microframework/parser"
import { defaultValidator } from "@microframework/validator"
import * as fs from "fs"
import * as path from "path"
import { DataSource, DataSourceOptions, EntitySchema } from "typeorm"
import { DefaultErrorHandler } from "../error-handler"
import { DefaultNamingStrategy } from "../naming-strategy"
import { ApplicationServerOptions } from "./application-server-options-type"
import { ApplicationServerProperties } from "./application-server-properties-type"
import { ResolverUtils } from "../util/resolver-utils"
import type { GraphQLError, GraphQLSchema } from "graphql"
import { graphqlHTTP, OptionsData } from "express-graphql"
import { Server as WebsocketServer } from "ws"

/**
 * Application Server utility functions.
 */
export const ApplicationServerUtils = {
  /**
   * Loads application metadata from the declaration file.
   * Given file name shouldn't have an extension.
   */
  loadAppMetadata(filenameWithoutExt: string): ApplicationTypeMetadata {
    const jsonFilePath = path.normalize(filenameWithoutExt + ".json")
    const tsFilePath = path.normalize(filenameWithoutExt + ".ts")
    const dtsFilePath = path.normalize(filenameWithoutExt + ".d.ts")

    if (fs.existsSync(jsonFilePath)) return require(jsonFilePath)
    if (fs.existsSync(tsFilePath)) return parse(tsFilePath)
    if (fs.existsSync(dtsFilePath)) return parse(dtsFilePath)

    throw new Error(
      `Application declaration is missing in "${filenameWithoutExt}.{.ts,.d.ts,.json}".` +
        `Please make sure you specified a correct path to the application declaration file in the "appPath" option.` +
        `Also make sure you didn't include file extension in the specified path of the "appPath" option.`,
    )
  },

  /**
   * Converts given type metadata models into TypeORM's MappedEntitySchemaProperty objects.
   * Those objects are used by TypeORM to set types to entity properties dynamically.

  modelsToApp(models: TypeMetadata[]): MappedEntitySchemaProperty[] {
    const mappedEntities: MappedEntitySchemaProperty[] = []
    for (let model of models) {
      for (let property of model.properties) {
        mappedEntities.push({
          model: model.typeName!,
          property: property.propertyName!,
          target: property.typeName!,
        })
      }
    }
    return mappedEntities
  },*/

  /**
   * Converts given ApplicationServerOptions object into ApplicationServerProperties object.
   * Sets default properties if something was not set in options.
   */
  optionsToProperties(
    options: ApplicationServerOptions,
  ): ApplicationServerProperties {
    const resolvers = ResolverUtils.normalizeResolverMetadatas(
      options.resolvers,
    )
    return {
      appPath: options.appPath,
      webserver: {
        express: options.webserver.express,
        port: options.webserver.port,
        cors: options.webserver.cors || false,
        cookieParser: options.webserver.cookieParser || false,
        staticDirs: options.webserver.staticDirs || {},
        middlewares: options.webserver.middlewares
          ? ApplicationUtils.mixedListToArray(options.webserver.middlewares)
          : [],
        actionMiddleware: options.webserver.actionMiddleware || {},
      },
      graphql: {
        route: options.graphql?.route || "/graphql",
        graphiql: options.graphql?.graphiql || false,
        playground: options.graphql?.playground,
        options: options.graphql?.options,
      },
      websocket: {
        port: options.websocket?.port,
        host: options.websocket?.host || "localhost",
        path: options.websocket?.path || "subscriptions",
        options: options.websocket?.options || {},
        pubSub: options.websocket?.pubSub,
        disconnectTimeout: options.websocket?.disconnectTimeout,
        websocketServer: options.websocket?.websocketServer,
      },
      swagger: options.swagger
        ? {
            route: options.swagger.route,
            document: options.swagger.document,
            options: options.swagger.options,
          }
        : undefined,
      namingStrategy: options.namingStrategy || DefaultNamingStrategy,
      errorHandler: options.errorHandler || DefaultErrorHandler,
      resolvers: resolvers,
      validationRules: options.validationRules
        ? ApplicationUtils.mixedListToArray(options.validationRules)
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
  },

  /**
   * Creates a GraphQL middleware for Express server.
   */
  createGraphQLMiddleware(
    schema: GraphQLSchema,
    graphiql: boolean,
    options: Partial<OptionsData>,
  ) {
    // create a graphql HTTP server
    return graphqlHTTP((request, response) => ({
      schema: schema,
      graphiql: graphiql,
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
      ...options,
    }))
  },

  /**
   * Middleware for the Playground.
   */
  createPlaygroundMiddleware(
    graphqlRoute: string,
    subscriptionsEndpoint: string,
  ) {
    const expressPlayground =
      require("graphql-playground-middleware-express").default
    return expressPlayground({
      endpoint: graphqlRoute,
      subscriptionsEndpoint: subscriptionsEndpoint,
    })
  },

  /**
   * Creates a websocket server.
   */
  createWebsocketServer(
    websocketProperties: ApplicationServerProperties["websocket"],
  ) {
    const wsServer: typeof WebsocketServer =
      websocketProperties.websocketServer || WebsocketServer
    let websocketServer = new wsServer({
      host: websocketProperties.host,
      port: websocketProperties.port,
      path: "/" + websocketProperties.path,
      ...websocketProperties.options,
    })

    // setup a disconnection timeout to know when websocket user is disconnected
    // https://github.com/websockets/ws#how-to-detect-and-close-broken-connections
    if (websocketProperties.disconnectTimeout) {
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
      }, websocketProperties.disconnectTimeout)

      websocketServer!!.on("close", function close() {
        clearInterval(interval)
      })
    }

    return websocketServer
  },
}
