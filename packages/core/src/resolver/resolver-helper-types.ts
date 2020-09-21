import { Action, AnyApplication, AnyApplicationOptions } from "../application"
import { ContextLogger } from "../logger"
import { ResolverMetadata } from "./resolver-metadata"
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
  request: any
  response: any
  logger: ContextLogger
}

/**
 * Represents any "key" resolver can resolve (particular query, mutation, action, subscription, model).
 * For example from declaration "{ queries: { posts(): Post[], post(): Post } }" it will take "posts"|"post".
 */
export type ResolveKey<D extends AnyApplicationOptions> =
  | keyof D["actions"]
  | keyof D["models"]
  | keyof D["queries"]
  | keyof D["mutations"]
  | keyof D["subscriptions"]

/**
 * Arguments to be passed to action resolving function.
 */
export type ActionArgs<A extends Action> = {
  params: A["params"]
  query: A["query"]
  headers: A["headers"]
  cookies: A["cookies"]
  body: A["body"]
}

/**
 * Type for a return values of declaration properties.
 */
export type ResolverReturnValue<T> =
  // T extends ModelWithArgs<infer Type, any> ? DeepPartial<Type> | Promise<DeepPartial<Type>> :
  // T extends Array<ModelWithArgs<infer Type, any>> ? DeepPartial<Type[]> | Promise<DeepPartial<Type[]>> :
  T extends Array<infer I>
    ? I extends boolean
      ? boolean[] | Promise<boolean[]>
      : I extends number
      ? number[] | Promise<number[]>
      : I extends string
      ? string[] | Promise<string[]>
      : I extends Object
      ? DeepPartial<I>[] | null | Promise<DeepPartial<I>[] | null>
      : I[] | null | Promise<I[] | null>
    : T extends boolean
    ? boolean | Promise<boolean>
    : T extends number
    ? number | Promise<number>
    : T extends string
    ? string | Promise<string>
    : null extends T
    ? null | Promise<null>
    : // T extends object | null ? DeepPartial<T | null> | Promise<DeepPartial<T> | null> :
    T extends Object
    ? DeepPartial<T | null> | Promise<DeepPartial<T> | null>
    : T | null | Promise<T | null>

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
 * Types or resolvers that can registered in the application.
 */
export type AppResolverType =
  | ResolverMetadata
  | DeclarationResolver<any>
  | { new (...args: any[]): DeclarationResolver<any> }
