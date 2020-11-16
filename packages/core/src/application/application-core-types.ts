import {
  AnyApplication,
  AnyApplicationOptions,
} from "./application-helper-types"

/**
 * Collection of root queries, mutations and subscriptions.
 */
export type GraphQLDeclarationList = {
  [name: string]: GraphQLDeclarationItem<any>
}

/**
 * Collection of actions (HTTP routes).
 */
export type ActionList = {
  [name: string]: AnyAction
}

/**
 * List of models defined in the application.
 */
export type ModelList = {
  [name: string]: ModelWithArgs<ModelType, ArgsOfModel<ModelType>> | ModelType
}

/**
 * List of inputs defined in the application.
 */
export type InputTypeList = {
  [name: string]: InputType
}

/**
 * List of context variables.
 */
export type ContextList = {
  [name: string]: any
}

/**
 * Type of the value returned by a single declaration.
 */
export type GraphQLDeclarationItemReturnType =
  | string
  | number
  | boolean
  | object
  | undefined
  | null

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
 * Action is a single HTTP route that serves network requests.
 */
export type Action<ReturnType, Params, Query, Headers, Cookies, Body> = {
  return?: ReturnType
  params?: Params
  query?: Query
  headers?: Headers
  cookies?: Cookies
  body?: Body
  middlewares?: () => any[]
}

/**
 * Action with any generic types.
 */
export type AnyAction = Action<any, any, any, any, any, any>

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
  "@type": "ModelWithArgs"
  type: Type
  args: Args
}

/**
 * Extracts a "real" model type out of mixed model type.
 * ModelWithArgs | ModelType is called a mixed model type.
 */
export type ModelOrigin<
  MixedModel extends
    | ModelWithArgs<ModelType, ArgsOfModel<ModelType>>
    | ModelType
> = MixedModel extends ModelWithArgs<ModelType, ArgsOfModel<ModelType>>
  ? MixedModel["type"]
  : MixedModel

/**
 * Input is a type of model that will be used as input for application declarations.
 */
export type InputType = any

/**
 * Represents any "key" resolver can resolve (particular query, mutation, action, subscription, model).
 * For example from declaration "{ queries: { posts(): Post[] }, mutations: { savePost(): Post } }"
 * it will take "posts"|"savePost".
 */
export type DeclarationKeys<Options extends AnyApplicationOptions> =
  | keyof Options["actions"]
  | keyof Options["models"]
  | keyof Options["queries"]
  | keyof Options["mutations"]
  | keyof Options["subscriptions"]

/**
 * Possible declaration types.
 */
export type DeclarationTypes =
  | "inputs"
  | "models"
  | "queries"
  | "mutations"
  | "subscriptions"
  | "actions"
