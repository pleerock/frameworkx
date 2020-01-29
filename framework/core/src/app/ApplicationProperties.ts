import {Connection} from "typeorm";
import {ContextResolver} from "../context";
import {ModelEntity} from "../entity";
import {ErrorHandler} from "../error-handler";
import {Logger} from "../logger";
import {Resolver} from "../types";
import {ValidationRule, Validator} from "../validation";
import {NamingStrategy} from "./NamingStrategy";

/**
 * Main Application properties.
 */
export type ApplicationProperties = {

  /**
   * ORM data source (connection) used in the application.
   */
  dataSource?: Connection

  /**
   * Callback that creates ORM data source.
   */
  dataSourceFactory?: (entities: any[]) => Promise<Connection>

  /**
   * Validation to be used for model and inputs validation.
   */
  validator?: Validator

  /**
   * Logger to be used for logging events.
   */
  logger: Logger

  /**
   * Handling errors logic.
   */
  errorHandler: ErrorHandler

  /**
   * Strategy for naming special identifiers used in the framework.
   */
  namingStrategy: NamingStrategy

  /**
   * Context data.
   */
  context: ContextResolver<any>

  /**
   * List of registered entities.
   */
  entities: ModelEntity<any>[]

  /**
   * List of registered resolvers.
   */
  resolvers: Resolver[]

  /**
   * List of registered validation rules.
   */
  validationRules: (ValidationRule<any, any> | ValidationRule<any, any>)[]

  /**
   * List of registered action middlewares.
   */
  actionMiddlewares: { [key: string]: () => any[] }

  /**
   * Indicates if framework should automatically generate root queries and mutations for your models.
   */
  generateModelRootQueries?: boolean

  /**
   * Maximal deepness for nested conditions of automatically generated queries.
   */
  maxGeneratedConditionsDeepness: number

  /**
   * PubSub used to publish events.
   */
  pubsub?: any
}
