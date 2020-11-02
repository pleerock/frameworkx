import { ApplicationUtils, TypeMetadata } from "@microframework/core"
import { debugLogger } from "@microframework/logger"
import { parse } from "@microframework/parser"
import { defaultValidator } from "@microframework/validator"
import * as fs from "fs"
import * as path from "path"
import { MappedEntitySchemaProperty } from "typeorm"
import { DefaultErrorHandler } from "../error-handler"
import { DefaultNamingStrategy } from "../naming-strategy"
import { ApplicationServerOptions } from "./ApplicationServerOptions"
import { ApplicationServerProperties } from "./ApplicationServerProperties"
import { ResolverUtils } from "../helper/resolver-utils"

/**
 * Application Server utility functions.
 */
export const ApplicationServerUtils = {
  /**
   * Loads application metadata from the declaration file.
   * Given file name shouldn't have an extension.
   */
  loadAppMetadata(filenameWithoutExt: string) {
    const jsonFilePath = path.normalize(filenameWithoutExt + ".json")
    const tsFilePath = path.normalize(filenameWithoutExt + ".ts")
    const dtsFilePath = path.normalize(filenameWithoutExt + ".d.ts")

    if (fs.existsSync(jsonFilePath)) return require(jsonFilePath)
    if (fs.existsSync(tsFilePath)) return parse(tsFilePath)
    if (fs.existsSync(dtsFilePath)) return parse(dtsFilePath)

    throw new Error(`${tsFilePath} or ${dtsFilePath} were not found!`)
  },

  /**
   * Converts given type metadata models into MappedEntitySchemaProperty objects.
   * These objects are used by TypeORM to set types to entity properties dynamically.
   */
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
  },

  /**
   * Converts given ApplicationServerOptions object into ApplicationServerProperties object
   * and sets default properties if something was not set in options.
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
      dataSource: options.dataSource,
      entities: options.entities,
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
}
