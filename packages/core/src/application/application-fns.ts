import { Application } from "./application-class"
import { AnyApplicationOptions } from "./application-helper-types"

/**
 * Creates a new Application based on a given options.
 */
export function createApp<Options extends AnyApplicationOptions>() {
  return new Application<Options>()
}
