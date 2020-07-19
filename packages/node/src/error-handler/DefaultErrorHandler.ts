import { LogEvent } from "@microframework/core"
import { CodeError } from "./CodeError"
import { ErrorHandler } from "./ErrorHandler"
import { HttpError } from "./HttpError"

/**
 * Default error handling logic.
 */
export const DefaultErrorHandler: ErrorHandler = {
  actionError(error: any, event: LogEvent) {
    let status = 500
    let jsonError: any = {}
    if (typeof error === "object" && error["typeof"] !== undefined) {
      if (error["typeof"] === "HttpError") {
        status = error.httpCode
        if (error.code) {
          jsonError["code"] = error.code
        }
        jsonError["message"] = error.message
        jsonError["stack"] = error.stack
      } else if (error["typeof"] === "CodeError") {
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
