import { Application } from "./application-class"
import { AnyApplicationOptions } from "./application-options"

/**
 * List of T items passed as an array of imported using import * as syntax.
 */
export type ListOfType<T> = T[] | { [key: string]: T }

/**
 * If given type is an array, extracts item type instead.
 * Returns given type if its not an array.
 */
export type NonArray<T> = T extends Array<infer U> ? U : T

/**
 * In the case if given type isn't a function, we just return its type.
 */
export type ReturnTypeOptional<T> = T extends (...args: any) => any
  ? ReturnType<T>
  : T

/**
 * Represents a given literal object, or a class instance that matches literal object signature.
 */
export type LiteralOrClass<T> = T | { new (...args: any[]): T }

/**
 * Type for the server implementation for application.
 */
// export type ApplicationServer = () => Promise<() => Promise<void>>

/**
 * Represents any application type.
 */
export type AnyApplication = Application<any>

/**
 * Creates a new Application instance.
 */
export function createApp<Options extends AnyApplicationOptions>() {
  return new Application<Options>()
}
