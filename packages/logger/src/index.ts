import { Logger } from "@microframework/core"

const debug = require("debug")

/**
 * Simple logger implementation that is using NPM's popular "debug" package.
 */
export const debugLogger: Logger = options => {

  let name = "[" + options.level + "] " + options.name
  if (!options.name) {
    if (options.type !== "any") {
      name += `${options.type}:`
    }
    if (options.event) {
      if (options.event.modelName) {
        name += `${options.event.modelName}:`
      }
      if (options.event.propertyName) {
        name += `${options.event.propertyName}:`
      }
      if (options.event.actionMetadata) {
        const actionName = options.event.actionMetadata.name
        const method = actionName.substr(0, actionName.indexOf(" ")).toLowerCase()
        const route = actionName.substr(actionName.indexOf(" ") + 1)
        name += `${method.toUpperCase()} ${route}:`
      }
    }
    if (name.substr(-1) === ":") {
      name = name.substr(0, name.length - 1)
    }
  }

  let message: any = options.message
  if (message instanceof Error) {
    message = `[${message.name}] ${message.message} (${message.stack})`

  } else if (typeof message === "object") {
      message = JSON.stringify(message)
  }

  return debug(name)(message)
}
