import {SelectionOf} from "../types";

/**
 * Collection of selections used for data query.
 */
export type SelectionList = {
  [name: string]: SelectionOf<any, any>
}

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
 * Declaration item arguments type.
 */
export type DeclarationItemArgs<Blueprint> = { // todo: should be renamed to ModelArgs ?
  [P in keyof Blueprint]?: ObjectLiteral
}

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
 * List of models defined in the application.
 */
export type ModelList = {
  [name: string]: Model<any, any>
}

/**
 * A single model list item.
 * Model list item can be either model type itself,
 * either model type + its args declarations.
 *
 * Examples:
 *   Post: Post
 *   Post: [Post, PostArgs]
 */
// export type ModelListItem = any | [any, any]

/**
 * Model is a type used in return of root declarations or model sub-types.
 * It can be a type itself, or a type plus its arguments (advanced).
 */
// export type Model<M extends ModelListItem> =
//   M extends [infer Blueprint, infer Args]
//     ? { blueprint: Blueprint, args: Args }
//     : { blueprint: M }

export type CastedModel<T> = T extends Model<any, any> ? T : Model<T>

export type Model<Blueprint, Args extends DeclarationItemArgs<Blueprint> = never> = {
  blueprint: Blueprint
  args: Args
}

/**
 * Input is a model that will be used as input for application declarations.
 */
export type Input = any

/**
 * List of inputs defined in the application.
 */
export type InputList = {
  [name: string]: Input
}

/**
 * List of context variables.
 */
export type ContextList = {
  [name: string]: any // string | number | boolean | object
}

export type ObjectLiteral = {
  [key: string]: any
}
