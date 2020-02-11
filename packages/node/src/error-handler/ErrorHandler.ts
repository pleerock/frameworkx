import { LogEvent } from "@microframework/core"

/**
 * Error handling interface.
 */
export type ErrorHandler = {

  /**
   * Error handling when error occurs on action.
   */
  actionError(error: any, event: LogEvent): void

  /**
   * Error handling when error occurs on a GraphQL resolver.
   */
  resolverError(error: any, event: LogEvent): void

}
