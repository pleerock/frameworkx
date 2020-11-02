import { AnyApplication, DeclarationKeys } from "@microframework/core"
import { RateLimitOptions } from "./RateLimitOptions"

/**
 * Helps to create a RateLimitOptions object for a particular app in a type-safe manner.
 */
export function rateLimits<
  App extends AnyApplication,
  Key extends DeclarationKeys<App["_options"]>
>(app: App, options: RateLimitOptions<App>): RateLimitOptions<App> {
  return options
}
