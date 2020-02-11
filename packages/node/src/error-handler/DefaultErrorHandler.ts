import { LogEvent } from "@microframework/core"
import { ErrorHandler } from "./ErrorHandler"

export const DefaultErrorHandler: ErrorHandler = {

  actionError(error: any, event: LogEvent) {
    event.response.status(500)
    event.response.json(error)
  },

  resolverError(error: any, event: LogEvent) {
    throw error
  }

}
