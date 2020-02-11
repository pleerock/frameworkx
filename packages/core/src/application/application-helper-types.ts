import { Application } from "./application-class"
import { AnyApplicationOptions } from "./application-options"

/**
 * List of T items passed as an array of imported using import * as syntax.
 */
export type ListOfType<T> = T[] | { [key: string]: T }

/**
 * Type for the server implementation for application.
 */
export type ApplicationServer = () => Promise<() => Promise<void>>

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
