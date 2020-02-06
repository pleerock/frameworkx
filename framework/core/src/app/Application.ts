import { Connection } from "typeorm";
import { ModelEntity } from "../entity";
import { DefaultErrorHandler, ErrorHandler } from "../error-handler";
import { DefaultLogger, Logger } from "../logger";
import { ApplicationMetadata } from "../metadata";
import { AppResolverType, ContextResolver, isResolverMetadata } from "../resolver";
import { ValidationRule, Validator } from "../validation";
import { ListOfType } from "./application-helper-types";
import { AnyApplicationOptions } from "./ApplicationOptions";
import { ApplicationProperties } from "./ApplicationProperties";
import { ApplicationServer } from "./ApplicationServer";
import { DefaultNamingStrategy } from "./DefaultNamingStrategy";

/**
 * Represents any application type.
 */
export type AnyApplication = Application<any>

/**
 * Application is a root point of the framework.
 */
export class Application<Options extends AnyApplicationOptions> {

  /**
   * Application properties.
   */
  readonly properties: ApplicationProperties = {
    dataSource: undefined,
    namingStrategy: DefaultNamingStrategy,
    errorHandler: DefaultErrorHandler,
    logger: DefaultLogger,
    entities: [],
    resolvers: [],
    validationRules: [],
    actionMiddlewares: {},
    maxGeneratedConditionsDeepness: 5,
  }

  /**
   * Application metadata.
   */
  readonly metadata: ApplicationMetadata = {
    name: "",
    actions: [],
    inputs: [],
    models: [],
    mutations: [],
    queries: [],
    subscriptions: [],
    selections: []
  }

  /**
   * Application options.
   */
  readonly _options!: Options

  /**
   * Stops the bootstrapped server.
   */
  private serverStopFn?: () => Promise<void>

  /**
   * Sets app metadata.
   */
  setMetadata(metadata: ApplicationMetadata) {
    this.metadata.name = metadata.name
    this.metadata.actions = metadata.actions
    this.metadata.queries = metadata.queries
    this.metadata.mutations = metadata.mutations
    this.metadata.subscriptions = metadata.subscriptions
    this.metadata.inputs = metadata.inputs
    this.metadata.models = metadata.models
    this.metadata.selections = metadata.selections
  }

  /**
   * Sets a data source (orm connection) to be used by application.
   */
  setDataSource(connectionFactory: (entities: any[]) => Promise<Connection>) {
    this.properties.dataSourceFactory = connectionFactory
    return this
  }

  /**
   * Specifies if framework should automatically generate root queries and mutations for your models.
   */
  setGenerateModelRootQueries(enabled: boolean) {
    this.properties.generateModelRootQueries = enabled
    return this
  }

  /**
   * Sets a validator to be used by application for model and input validation.
   */
  setValidator(validator: Validator) {
    this.properties.validator = validator
    return this
  }

  /**
   * Sets resolvers used to resolve queries, mutations, subscriptions, actions, models and context.
   */
  setResolvers(resolvers: AppResolverType[] | { [key: string]: AppResolverType }) {
    this.properties.resolvers = []
    this.addResolvers(resolvers)
    return this
  }

  /**
   * Adds resolvers used to resolve queries, mutations, subscriptions, actions, models and context.
   */
  addResolvers(resolvers: AppResolverType[] | { [key: string]: AppResolverType }) {
    if (resolvers instanceof Array) {
      this.properties.resolvers.push(...resolvers.map(resolver => {
        if (resolver instanceof Function) {
          return resolver.prototype.resolver

        } else if (resolver instanceof Object && !isResolverMetadata(resolver)) {
          return {
            instanceof: "Resolver",
            type: "declaration-resolver",
            declarationType: "any",
            resolverFn: resolver,
          }

        } else {
          return resolver
        }
      }))

    } else {
      this.properties.resolvers = Object.keys(resolvers).map(key => {
        const resolver = resolvers[key]
        if (resolver instanceof Function) {
          return resolver.prototype.resolver

        } else if (resolver instanceof Object && !isResolverMetadata(resolver)) {
          return {
            instanceof: "Resolver",
            type: "declaration-resolver",
            declarationType: "any",
            resolverFn: resolver,
          }

        } else {
          return resolver
        }
      })
    }
    return this
  }

  /**
   * Sets a database entities.
   */
  setEntities(entities: ListOfType<ModelEntity<any>>) {
    this.properties.entities = []
    this.addEntities(entities)
    return this
  }

  /**
   * Adds a database entities.
   */
  addEntities(entities: ListOfType<ModelEntity<any>>) {
    if (entities instanceof Array) {
      this.properties.entities = entities
    } else {
      this.properties.entities = Object.keys(entities).map(key => entities[key])
    }
    return this
  }

  /**
   * Sets validation rules.
   */
  setValidationRules(validationRules: ListOfType<ValidationRule<any, any>>) {
    this.properties.validationRules = []
    this.addValidationRules(validationRules)
    return this
  }
  
  /**
   * Adds validation rules.
   */
  addValidationRules(validationRules: ListOfType<ValidationRule<any, any>>) {
    if (validationRules instanceof Array) {
      this.properties.validationRules = validationRules
    } else {
      this.properties.validationRules = Object.keys(validationRules).map(key => validationRules[key])
    }
    return this
  }

  /**
   * Sets a logger to be used by application for logging events.
   */
  setLogger(logger: Logger) {
    this.properties.logger = logger
    return this
  }

  /**
   * Sets an error handler to be used by application for handling errors.
   */
  setErrorHandler(errorHandler: ErrorHandler) {
    this.properties.errorHandler = errorHandler
    return this
  }

  /**
   * Sets middlewares for given actions.
   */
  setActionMiddlewares(middlewares: { [key: string]: () => any[] }) {
    this.properties.actionMiddlewares = {}
    this.addActionMiddlewares(middlewares)
    return this
  }

  /**
   * Adds middlewares for given actions.
   */
  addActionMiddlewares(middlewares: { [key: string]: () => any[] }) {
    this.properties.actionMiddlewares = { ...this.properties.actionMiddlewares, ...middlewares }
    return this
  }

  /**
   * Bootstraps a server.
   */
  async bootstrap(serverImpl: ApplicationServer): Promise<void> {
    this.serverStopFn = await serverImpl()
  }

  /**
   * Stops the running server.
   */
  async stop(): Promise<void> {
    if (this.serverStopFn !== undefined)
      await this.serverStopFn()
  }

  /**
   * Returns logger.
   */
  get logger() {
    return this.properties.logger
  }

}
