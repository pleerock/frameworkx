import { LogEvent } from "@microframework/core"

/**
 * Defines a type which you can implement to provide a custom logic
 * when error is thrown.
 */
export type ErrorHandler = {
  /**
   * Error handling when error occurs on action.
   */
  actionError(error: any, event: LogEvent): void | Promise<void>

  /**
   * Error handling when error occurs on a GraphQL resolver.
   */
  resolverError(error: any, event: LogEvent): void | Promise<void>
}
