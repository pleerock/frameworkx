import { Application } from "./application-class"
import { ApplicationOptions } from "./application-options"

/**
 * List of T symbols passed as an array or imported using import * as syntax.
 */
export type MixedList<T> = T[] | { [key: string]: T }

/**
 * If given type is an array, extracts item type instead.
 * Returns given type if its not an array.
 */
export type NonArray<T> = T extends Array<infer U> ? U : T

/**
 * In the case if given type isn't a function, just return its type.
 */
export type ReturnTypeOptional<T> = T extends (...args: any) => any
  ? ReturnType<T>
  : T

/**
 * Represents a given literal object, or a class instance that matches literal object signature.
 */
export type LiteralOrClass<T> = T | { new (...args: any[]): T }

/**
 * Handy way of using Application type when its options don't matter.
 */
export type AnyApplication = Application<any>

/**
 * Handy way of using ApplicationOptions type when its generics don't matter.
 */
export type AnyApplicationOptions = ApplicationOptions<
  any,
  any,
  any,
  any,
  any,
  any,
  any
>
