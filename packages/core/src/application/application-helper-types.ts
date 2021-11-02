import { ApplicationOptions } from "./application-options"
import {
  ActionList,
  ContextList,
  GraphQLDeclarationList,
  InputTypeList,
  ModelList,
} from "./application-core-types"
import { Application } from "./application-type"

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
 * If given T type is exactly a Desired one, returns just this T type.
 * Otherwise returns "any". Used to for force typing.
 */
export type ForcedType<T, Desired, CastTo = any> = T extends Desired
  ? T
  : CastTo

/**
 * FlatMap for a type - if given type is an array - returns array's generic type,
 * otherwise simply returns a type.
 */
export type FlatMapType<T> = T extends Array<infer U> ? U : T

/**
 * Checks if given type is nullable and returns "true" literal type if it is.
 */
export type IsNullable<T> = null extends T ? true : false

/**
 * Like Partial<T>, but deep.
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends Array<infer U>
    ? Array<DeepPartial<U>>
    : T[P] extends ReadonlyArray<infer U>
    ? ReadonlyArray<DeepPartial<U>>
    : DeepPartial<T[P]>
}

/**
 * Handy way of using Application type when its options don't matter.
 */
export type AnyApplication = Application<AnyApplicationOptions>

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
