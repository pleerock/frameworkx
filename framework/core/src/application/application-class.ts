import { DefaultLogger, Logger } from "../logger";
import { ApplicationTypeMetadata } from "../type-metadata";
import { ValidationRule, Validator } from "../validation";
import { ApplicationServer, ListOfType } from "./application-helper-types";
import { AnyApplicationOptions } from "./application-options";
import { ApplicationProperties } from "./application-properties";

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
    logger: DefaultLogger,
    validationRules: [],
  }

  /**
   * Application types metadata.
   */
  readonly metadata: ApplicationTypeMetadata = {
    name: "",
    actions: [],
    inputs: [],
    models: [],
    mutations: [],
    queries: [],
    subscriptions: [],
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
   * Provides access to app logger.
   */
  get logger() {
    return this.properties.logger
  }

  /**
   * Sets app metadata.
   */
  setMetadata(metadata: ApplicationTypeMetadata): this {
    this.metadata.name = metadata.name
    this.metadata.actions = metadata.actions
    this.metadata.queries = metadata.queries
    this.metadata.mutations = metadata.mutations
    this.metadata.subscriptions = metadata.subscriptions
    this.metadata.inputs = metadata.inputs
    this.metadata.models = metadata.models
    return this
  }

  /**
   * Sets a validator to be used by application for model and input validation.
   */
  setValidator(validator: Validator): this {
    this.properties.validator = validator
    return this
  }

  /**
   * Sets validation rules.
   */
  setValidationRules(validationRules: ListOfType<ValidationRule<any, any>>): this {
    this.properties.validationRules = []
    this.addValidationRules(validationRules)
    return this
  }
  
  /**
   * Adds validation rules.
   */
  addValidationRules(validationRules: ListOfType<ValidationRule<any, any>>): this {
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
  setLogger(logger: Logger): this {
    this.properties.logger = logger
    return this
  }

  /**
   * Bootstraps a server.
   */
  async bootstrap(server: ApplicationServer): Promise<void> {
    this.serverStopFn = await server()
  }

  /**
   * Stops the running server.
   */
  async stop(): Promise<void> {
    if (this.serverStopFn !== undefined)
      await this.serverStopFn()
  }

}
