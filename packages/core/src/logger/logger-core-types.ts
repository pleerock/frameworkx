import { ActionTypeMetadata, TypeMetadata } from "../type-metadata"

/**
 * Logging event details.
 */
export type LogEvent = {
  request: any
  response: any
  typeMetadata?: TypeMetadata
  actionMetadata?: ActionTypeMetadata
  modelName?: string
  propertyName?: string
  graphQLResolverArgs?: {
    parent: any
    args: any
    context: any
    info: any
  }
}

/**
 * Options provided to the logger interface methods call.
 */
export type LoggerLogOptions = {
  /**
   * Logger name.
   */
  name: string

  /**
   * Logging level.
   */
  level: "verbose" | "info" | "warning" | "error"

  /**
   * Operation type.
   */
  type: "query" | "mutation" | "subscription" | "model" | "action" | "any"

  /**
   * Logging message.
   */
  message: string

  /**
   * Additional information that can be used in logging.
   */
  event?: LogEvent
}

/**
 * Logger interface.
 */
export type Logger = (options: LoggerLogOptions) => void
