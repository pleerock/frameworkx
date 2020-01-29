import { Connection } from "typeorm";
import { ContextResolver } from "../context";
import { ModelEntity } from "../entity";
import { DefaultErrorHandler, ErrorHandler } from "../error-handler";
import { DefaultLogger, Logger } from "../logger";
import { ApplicationMetadata } from "../metadata";
import { DeclarationResolverConstructor, Resolver } from "../types";
import { ValidationRule, Validator } from "../validation";
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
    context: {},
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
   * Sets resolvers used to resolve queries, mutations, subscriptions, actions and models.
   */
  setResolvers(resolvers: Resolver[] | { [key: string]: Resolver } | DeclarationResolverConstructor) {
    if (resolvers instanceof Array) {
      this.properties.resolvers = resolvers
    } else if (resolvers instanceof Function) {

    } else {
      this.properties.resolvers = Object.keys(resolvers).map(key => resolvers[key])
    }
    return this
  }

  /**
   * Sets a database entities.
   */
  setEntities(entities: ModelEntity<any>[] | { [key: string]: ModelEntity<any> }) {
    if (entities instanceof Array) {
      this.properties.entities = entities
    } else {
      this.properties.entities = Object.keys(entities).map(key => entities[key])
    }
    // if (entities instanceof Array) {
    //   this.properties.entities = entities.map(entity => ModelEntity.copy(this.properties, this.metadata, entity))
    // } else {
    //   this.properties.entities = Object.keys(entities).map(key => {
    //     return ModelEntity.copy(this.properties, this.metadata, entities[key])
    //   })
    // }
    return this
  }

  /**
   * Sets validation rules.
   */
  setValidationRules(validationRules: (ValidationRule<any, any> | ValidationRule<any, any>)[] | { [key: string]: (ValidationRule<any, any> | ValidationRule<any, any>) }) {
    if (validationRules instanceof Array) {
      this.properties.validationRules = validationRules
    } else {
      this.properties.validationRules = Object.keys(validationRules).map(key => validationRules[key])
    }
    return this
  }

  /**
   * Sets a context.
   */
  setContext(context: ContextResolver<Options["context"]>) {
    this.properties.context = context
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
    this.properties.actionMiddlewares = middlewares
    return this
  }

  /**
   * Bootstraps a server.
   */
  async bootstrap(serverImpl: ApplicationServer): Promise<void> {
    await serverImpl()
  }

  /**
   * Creates a context object.
   */
  context(context: ContextResolver<Options["context"]>): ContextResolver<Options["context"]> {
    return context
  }

  /**
   * Returns logger.
   */
  get logger() {
    return this.properties.logger
  }

}
