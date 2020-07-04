import { LogEvent } from "@microframework/core"
import { CodeError } from "./CodeError"
import { ErrorHandler } from "./ErrorHandler"
import { HttpError } from "./HttpError"

export const DefaultErrorHandler: ErrorHandler = {
  actionError(error: any, event: LogEvent) {
    let status = 500
    let jsonError: any = {}
    if (typeof error === "object" && error["instanceof"] !== undefined) {
      if (error["instanceof"] === "HttpError") {
        status = error.httpCode
        jsonError["message"] = error.message
        if (error.code) {
          jsonError["code"] = error.code
        }
      } else if (error["instanceof"] === "CodeError") {
        jsonError["message"] = error.message
        jsonError["code"] = error.code
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
