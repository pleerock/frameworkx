
/**
 * Collection of root query or mutation declarations.
 */
export type DeclarationList = {
  [name: string]: DeclarationItem
}

/**
 * Type of the value returned by a single declaration.
 */
export type DeclarationItemReturnType =
  | string
  | number
  | boolean
  | object
  // | Model<any, any>
  // | string[]
  // | number[]
  // | boolean[]
  // | Model<any, any>[]

/**
 * A single root query or mutation declaration.
 * Declaration item either can return a primitive, either Model instance.
 *
 * Examples:
 *    post(args: { id: number }): PostModel
 *    posts(): PostModel[]
 *    postsCount(): number
 */
export type DeclarationItem =
    | ((args: ObjectLiteral) => DeclarationItemReturnType) // example: post(args: { id: number }): Post
    | (() => DeclarationItemReturnType)  // example: posts(): Post[]

/**
 * Action used for HTTP route queries.
 */
export type ActionTypeDetailed<A extends Action> = {
  params: A["params"] extends Object ? A["params"] : never
  query: A["query"] extends Object ? A["query"] : never
  header: A["header"] extends Object ? A["header"] : never
  cookies: A["cookies"] extends Object ? A["cookies"] : never
  body: A["body"] extends Object ? A["body"] : never
}

/**
 * Action used for HTTP route queries.
 * Removed all never properties from ActionTypeDetailed type.
 */
export type ActionType<A extends Action> = ActionTypeDetailed<A>[keyof ActionTypeDetailed<A>]

/**
 * Possible action methods.
 */
export type ActionMethod = "get" | "post" | "patch" | "put" | "delete" | string

/**
 * Collection of actions (HTTP routes).
 */
export type ActionList = {
  [name: string]: Action
}

/**
 * Action is a single HTTP route that serves network requests.
 *
 * Examples:
 *    {
 *      "/users": {
 *        type: "GET",
 *        return: User,
 *        query: {
 *            limit: number,
 *            offset: number
 *        }
 *      }
 *    }
 */
export type Action = {
  type: ActionMethod
  return?: any
  params?: any
  query?: any
  header?: any
  cookies?: any
  body?: any
  middlewares?: () => any[]
}

/**
 *
 */
export type ModelList = {
  [name: string]: ModelWithArgs<ModelType, ArgsOfModel<ModelType>> | ModelType
}

/**
 * Signature for Model Args.
 */
export type ArgsOfModel<Type extends ModelType> = {
  [P in keyof Type]?: ObjectLiteral
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
 * Input is a model that will be used as input for application declarations.
 */
export type ModelType = any

/**
 * Input is a model that will be used as input for application declarations.
 */
export type InputType = any

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

export type ObjectLiteral = {
  [key: string]: any
}
