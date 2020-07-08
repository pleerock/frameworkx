import { AnyApplication } from "@microframework/core"
import { RateLimitItemOptions } from "./RateLimitItemOptions"

/**
 * Interface, used to define rate limitation options for any query / mutation / model or action
 * in the app in a type-safe manner.
 */
export type RateLimitOptions<App extends AnyApplication> = {
  actions?: {
    [P in keyof App["_options"]["actions"]]?: RateLimitItemOptions
  }
  queries?: {
    [P in keyof App["_options"]["queries"]]?: RateLimitItemOptions
  }
  mutations?: {
    [P in keyof App["_options"]["mutations"]]?: RateLimitItemOptions
  }
  models?: {
    [P in keyof App["_options"]["models"]]?: {
      [MP in keyof App["_options"]["models"][P]]?: RateLimitItemOptions
    }
  }
}
