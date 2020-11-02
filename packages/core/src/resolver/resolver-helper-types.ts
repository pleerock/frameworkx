import { AnyAction, AnyApplicationOptions, DeepPartial } from "../application"
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
 * Represents any "key" resolver can resolve (particular query, mutation, action, subscription, model).
 * For example from declaration "{ queries: { posts(): Post[] }, mutations: { savePost(): Post } }"
 * it will take "posts"|"savePost".
 */
export type ResolveKey<Options extends AnyApplicationOptions> =
  | keyof Options["actions"]
  | keyof Options["models"]
  | keyof Options["queries"]
  | keyof Options["mutations"]
  | keyof Options["subscriptions"]

/**
 * Arguments to be passed to action resolving function.
 */
export type ActionArgs<Action extends AnyAction> = {
  /**
   * Route params received in HTTP request.
   */
  params: Action["params"]

  /**
   * Query params received in HTTP request.
   */
  query: Action["query"]

  /**
   * HTTP headers sent within HTTP request.
   */
  headers: Action["headers"]

  /**
   * Cookies sent within HTTP request.
   */
  cookies: Action["cookies"]

  /**
   * HTTP body sent by a client.
   */
  body: Action["body"]
}

/**
 * Checks if given type is nullable and returns "true" literal type if it is.
 */
export type IsNullable<T> = null extends T ? true : false

/**
 * Resolver possible return value type.
 */
export type ResolverReturnValue<T> = IsNullable<T> extends true
  ? NonNullable<T> extends Array<infer U>
    ? U extends boolean
      ?
          | boolean[]
          | null
          | Promise<boolean[]>
          | Promise<boolean[] | null>
          | Promise<null>
      : U extends number
      ?
          | number[]
          | null
          | Promise<number[]>
          | Promise<number[] | null>
          | Promise<null>
      : U extends string
      ?
          | string[]
          | null
          | Promise<string[]>
          | Promise<string[] | null>
          | Promise<null>
      :
          | U[]
          | DeepPartial<U>[]
          | null
          | Promise<U[]>
          | Promise<U[] | null>
          | Promise<DeepPartial<U>[]>
          | Promise<DeepPartial<U>[] | null>
          | Promise<null>
    : NonNullable<T> extends boolean
    ? boolean | null | Promise<boolean> | Promise<boolean | null>
    : NonNullable<T> extends number
    ? number | null | Promise<number> | Promise<number | null>
    : NonNullable<T> extends string
    ? string | null | Promise<string> | Promise<string | null>
    : NonNullable<T> extends Object
    ?
        | T
        | DeepPartial<T>
        | null
        | Promise<T | null>
        | Promise<DeepPartial<T> | null>
        | Promise<null>
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

// todo: tests like this
// const a: ResolverReturnValue<{ id: number } | null> = Promise.resolve(null)

/**
 * Types or resolvers that can registered in the application.
 */
export type AppResolverType =
  | AnyResolver
  | DeclarationResolver<any>
  | { new (...args: any[]): any }
/* | { new (...args: any[]): DeclarationResolver<any> } // for some reason this doesn't work */
