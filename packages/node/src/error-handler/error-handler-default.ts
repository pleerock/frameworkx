import { LogEvent } from "@microframework/core"
import { CodeError, ErrorHandler, HttpError } from "./"

/**
 * Default error handling logic.
 */
export const DefaultErrorHandler: ErrorHandler = {
  actionError(error: any, event: LogEvent) {
    let status = 500
    let jsonError: any = {}
    if (typeof error === "object" && error["@type"] !== undefined) {
      if (error["@type"] === "HttpError") {
        status = error.httpCode
        if (error.code) {
          jsonError["code"] = error.code
        }
        jsonError["message"] = error.message
        jsonError["stack"] = error.stack
      } else if (error["@type"] === "ValidationError") {
        status = 400
        if (error.code) {
          jsonError["code"] = error.code
        }
        jsonError["message"] = error.message
        jsonError["stack"] = error.stack
      } else if (error["@type"] === "CodeError") {
        jsonError["code"] = error.code
        jsonError["message"] = error.message
        jsonError["stack"] = error.stack
      }
    } else if (error instanceof Error) {
      jsonError["message"] = error.message
      jsonError["stack"] = error.stack
    } else {
      jsonError = error
    }
    event.response.status(status)
    event.response.json(jsonError)
  },

  resolverError(error: any, event: LogEvent) {
    throw error
  },
}
