
/**
 * Collection of root queries, mutations and subscriptions.
 */
export type GraphQLDeclarationList = {
  [name: string]: GraphQLDeclarationItem
}

/**
 * Collection of actions (HTTP routes).
 */
export type ActionList = {
  [name: string]: Action
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

/**
 * A single root query, mutation or subscription declaration.
 *
 * Examples:
 *    post(args: { id: number }): Post
 *    posts(): Post[]
 *    postsCount(): number
 */
export type GraphQLDeclarationItem =
    | ((args: { [key: string]: any }) => GraphQLDeclarationItemReturnType) // example: post(args: { id: number }): Post
    | (() => GraphQLDeclarationItemReturnType)  // example: posts(): Post[]

/**
 * Action is a single HTTP route that serves network requests.
 */
export type Action = {
  type: "get" | "post" | "patch" | "put" | "delete" | string
  return?: any
  params?: any
  query?: any
  header?: any
  cookies?: any
  body?: any
  middlewares?: () => any[]
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
export type ModelWithArgs<Type extends ModelType, Args extends ArgsOfModel<Type>> = {
  instanceof: "ModelWithArgs",
  type: Type
  args: Args
}

/**
 * Input is a type of model that will be used as input for application declarations.
 */
export type InputType = any
