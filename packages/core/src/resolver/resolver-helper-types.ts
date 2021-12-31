import {
  AnyAction,
  AnyApplication,
  AnyApplicationOptions,
  DeclarationKeys,
  DeepPartial,
  IsNullable,
} from "../application"
import { ContextLogger } from "../logger"
import { AnyResolver } from "./resolver-metadata"
import { DeclarationResolver } from "./resolver-strategy"

/**
 * What type of things we can create resolver for.
 */
export type ResolverType =
  | "query"
  | "mutation"
  | "subscription"
  | "model"
  | "action"

/**
 * Default framework properties applied to a context.
 */
export type DefaultContext = {
  /**
   * HTTP request.
   */
  request: any

  /**
   * HTTP response.
   */
  response: any

  /**
   * Contextual logger used to log events during resolve execution.
   */
  logger: ContextLogger
}

/**
 * Arguments to be passed to action resolving function.
 */
export type ActionArgs<Action extends AnyAction> = Pick<
  Action,
  "params" | "query" | "headers" | "cookies" | "body"
>

/**
 * Helper type to get input args of a given declaration.
 *
 * todo: rename to ArgsOf
 */
export type InputOf<
  App extends AnyApplication,
  Method extends DeclarationKeys<App["_options"]>
> = App["_options"]["queries"][Method] extends Function
  ? Parameters<App["_options"]["queries"][Method]>[0]
  : App["_options"]["mutations"][Method] extends Function
  ? Parameters<App["_options"]["mutations"][Method]>[0]
  : App["_options"]["subscriptions"][Method] extends Function
  ? Parameters<App["_options"]["subscriptions"][Method]>[0]
  : App["_options"]["actions"][Method] extends Function
  ? Parameters<App["_options"]["actions"][Method]>[0]
  : unknown

/**
 * Resolver possible return value type.
 */
export type ResolverReturnValue<T> = IsNullable<T> extends true
  ? NonNullable<T> extends Array<infer U>
    ? U extends boolean
      ? boolean[] | null | undefined | Promise<boolean[] | null | undefined>
      : U extends number
      ? number[] | null | undefined | Promise<number[] | null | undefined>
      : U extends string
      ? string[] | null | undefined | Promise<string[] | null | undefined>
      :
          | U[]
          | DeepPartial<U>[]
          | null
          | undefined
          | Promise<U[] | DeepPartial<U>[] | null | undefined>
    : NonNullable<T> extends boolean
    ?
        | boolean
        | null
        | undefined
        | Promise<boolean>
        | Promise<boolean | null | undefined>
    : NonNullable<T> extends number
    ?
        | number
        | null
        | undefined
        | Promise<number>
        | Promise<number | null | undefined>
    : NonNullable<T> extends string
    ?
        | string
        | null
        | undefined
        | Promise<string>
        | Promise<string | null | undefined>
    : NonNullable<T> extends Object
    ?
        | T
        | DeepPartial<T>
        | null
        | undefined
        | Promise<T | DeepPartial<T> | null | undefined>
    : unknown
  : T extends Array<infer U>
  ? U extends boolean
    ? boolean[] | Promise<boolean[]>
    : U extends number
    ? number[] | Promise<number[]>
    : U extends string
    ? string[] | Promise<string[]>
    : U[] | DeepPartial<U>[] | Promise<U[]> | Promise<DeepPartial<U>[]>
  : T extends boolean
  ? boolean | Promise<boolean>
  : T extends number
  ? number | Promise<number>
  : T extends string
  ? string | Promise<string>
  : T | DeepPartial<T> | Promise<T> | Promise<DeepPartial<T>>

/**
 * Resolver possible return value type.
 */
export type ResolverReturnValueArray<T> = IsNullable<T> extends true
  ? NonNullable<T> extends Array<infer U>
    ? U extends boolean
      ?
          | (boolean[] | null | undefined)[]
          | Promise<(boolean[] | null | undefined)[]>
      : U extends number
      ?
          | (number[] | null | undefined)[]
          | Promise<(number[] | null | undefined)[]>
      : U extends string
      ?
          | (string[] | null | undefined)[]
          | Promise<(string[] | null | undefined)[]>
      :
          | (U[] | DeepPartial<U>[] | null | undefined)[]
          | Promise<(U[] | DeepPartial<U>[] | null | undefined)[]>
    : NonNullable<T> extends boolean
    ?
        | (boolean | null | undefined)[]
        | Promise<boolean[]>
        | Promise<(boolean | null | undefined)[]>
    : NonNullable<T> extends number
    ?
        | (number | null | undefined)[]
        | Promise<number[]>
        | Promise<(number | null | undefined)[]>
    : NonNullable<T> extends string
    ?
        | (string | null | undefined)[]
        | Promise<string[]>
        | Promise<(string | null | undefined)[]>
    : NonNullable<T> extends Object
    ?
        | (T | DeepPartial<T> | null | undefined)[]
        | Promise<(T | DeepPartial<T> | null | undefined)[]>
    : unknown
  : T extends Array<infer U>
  ? U extends boolean
    ? boolean[][] | Promise<boolean[][]>
    : U extends number
    ? number[][] | Promise<number[][]>
    : U extends string
    ? string[][] | Promise<string[][]>
    : U[][] | DeepPartial<U>[][] | Promise<U[][]> | Promise<DeepPartial<U>[][]>
  : T extends boolean
  ? boolean[] | Promise<boolean[]>
  : T extends number
  ? number[] | Promise<number[]>
  : T extends string
  ? string[] | Promise<string[]>
  : T[] | DeepPartial<T[]> | Promise<T[]> | Promise<DeepPartial<T>[]>

/**
 * Types or resolvers that can registered in the application.
 */
export type AppResolverType =
  | AnyResolver
  | DeclarationResolver<any>
  | { new (...args: any[]): any }
/* | { new (...args: any[]): DeclarationResolver<any> } // for some reason this doesn't work */
