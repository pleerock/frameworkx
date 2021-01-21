import { AnyApplicationOptions } from "./application-helper-types"

/**
 * List of models defined in the application.
 */
export type ModelList = {
  [name: string]: ModelMixed
}

/**
 * Model type.
 */
export type ModelType = any

/**
 * Type for defining Model args.
 */
export type ArgsOfModel<Type extends ModelType> = {
  [P in keyof Type]?: {
    [key: string]: any
  }
}

/**
 * Used to create a model with Args.
 */
export type ModelWithArgs<
  Type extends ModelType,
  Args extends ArgsOfModel<Type>
> = {
  type: Type
  args: Args
}

/**
 * Extracts a "real" model type out of mixed model type.
 * ModelWithArgs | ModelType is called a mixed model type.
 */
export type ModelOrigin<T extends ModelMixed> = T extends ModelWithArgs<
  ModelType,
  ArgsOfModel<ModelType>
>
  ? T["type"]
  : T

/**
 * ModelWithArgs | ModelType is called a mixed model type.
 * Model can be defined as a regular type or a ModelWithArgs
 * which represents a type plus arguments accepted by a type properties.
 */
export type ModelMixed =
  | ModelWithArgs<ModelType, ArgsOfModel<ModelType>>
  | ModelType

/**
 * List of inputs defined in the application.
 */
export type InputTypeList = {
  [name: string]: any
}

/**
 * List of context variables.
 */
export type ContextList = {
  [name: string]: any
}

/**
 * Collection of root queries, mutations and subscriptions.
 */
export type GraphQLDeclarationList = {
  [name: string]: GraphQLDeclarationItem<any>
}

/**
 * A single root query, mutation or subscription declaration.
 *
 * Examples:
 *    post(args: { id: number }): Post
 *    posts(): Post[]
 *    postsCount(): number
 */
export type GraphQLDeclarationItem<ArgsType extends { [key: string]: any }> =
  | ((args: ArgsType) => GraphQLDeclarationItemReturnType) // example: post(args: { id: number }): Post
  | (() => GraphQLDeclarationItemReturnType) // example: posts(): Post[]

/**
 * Type of the value returned by a single GraphQL declaration.
 */
export type GraphQLDeclarationItemReturnType =
  | string
  | number
  | boolean
  | object
  | undefined
  | null

/**
 * Collection of actions (HTTP routes).
 */
export type ActionList = {
  [name: string]: AnyAction
}

/**
 * Action is a single HTTP route that serves network requests.
 */
export type Action<ReturnType, Params, Query, Headers, Cookies, Body> = {
  return: ReturnType
  params: Params
  query: Query
  headers: Headers
  cookies: Cookies
  body: Body
  // middlewares?: () => any[]
}

/**
 * Action with any generic types.
 * Helper type.
 */
export type AnyAction = Partial<Action<any, any, any, any, any, any>>

/**
 * Extracts declaration "keys" from any declaration types in the application declaration.
 * For example from a following declaration:
 * "{ queries: { posts(): Post[] }, mutations: { savePost(): Post } }"
 * it will take "posts"|"savePost".
 */
export type DeclarationKeys<Options extends AnyApplicationOptions> =
  | keyof Options["actions"]
  | keyof Options["models"]
  | keyof Options["queries"]
  | keyof Options["mutations"]
  | keyof Options["subscriptions"]

/**
 * Possible declaration types in the application declaration.
 */
export type DeclarationTypes =
  | "inputs"
  | "models"
  | "queries"
  | "mutations"
  | "subscriptions"
  | "actions"
