import { LogEvent } from "@microframework/core"
import { ErrorHandler } from "@microframework/node"

export const CustomErrorHandler: ErrorHandler = {
  actionError(error: any, event: LogEvent) {
    event.response.status(400)
    event.response.json({
      message: error instanceof Error ? error.message : "Error =(",
    })
  },

  resolverError(error: any, event: LogEvent) {
    event.response.status(400)
    throw new Error("Error =(")
  },
}
