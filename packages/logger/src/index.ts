import { Logger } from "@microframework/core"

const debug = require("debug")

export const debugLogger: Logger = {

  log(name: string, message: string) {
    return debug(name)(message)
  },

  error(name: string, message: string) {
    return debug(name)(message)
  },

}
