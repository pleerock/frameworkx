import { AnyApplication, DeclarationKeys } from "@microframework/core"

/**
 * Helps to create a RateLimitOptions object for a particular app in a type-safe manner.
 */
export function rateLimits<
  App extends AnyApplication,
  Key extends DeclarationKeys<App["_options"]>
>(app: App, options: RateLimitOptions<App>): RateLimitOptions<App> {
  return options
}

/**
 * Rate limitation for single query / mutation / model / action.
 * Although it doesn't tight to a particular package, by default its recommended to use
 * https://github.com/animir/node-rate-limiter-flexible package and this interface has all
 * options from this particular package.
 */
export type RateLimitItemOptions = {
  keyPrefix?: string
  points?: number
  duration?: number
  execEvenly?: boolean
  execEvenlyMinDelayMs?: number
  blockDuration?: number
  storeClient?: any
  storeType?: string
  inmemoryBlockOnConsumed?: number
  inmemoryBlockDuration?: number
  insuranceLimiter?: any
  dbName?: string
  tableName?: string
} & { [key: string]: any }

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
