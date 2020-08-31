import { AnyApplication, GraphQLDeclarationItem } from "../application"

/**
 * Helper type for RequestSelectionSchema type.
 */
export type RequestSelectionSchemaMapItem<T> = T extends Array<infer U>
  ? U extends string
    ? boolean
    : U extends number
    ? boolean
    : U extends boolean
    ? boolean
    : RequestSelectionSchemaMap<U>
  : T extends Object
  ? RequestSelectionSchemaMap<T>
  : boolean

/**
 * Helper type for RequestSelectionSchema type.
 */
export type RequestSelectionSchemaMap<T> = {
  [P in keyof T]?: T[P] extends Array<infer U>
    ? U extends string
      ? boolean
      : U extends number
      ? boolean
      : U extends boolean
      ? boolean
      : RequestSelectionSchemaMapItem<U>
    : boolean
}

/**
 * Request selection schema itself.
 * Selection schema defines what properties of a declaration item model will be selected.
 */
export type RequestSelectionSchema<
  App extends AnyApplication,
  Declaration extends GraphQLDeclarationItem
> = ReturnType<Declaration> extends Array<infer U>
  ? RequestSelectionSchemaMap<U>
  : ReturnType<Declaration> extends Object
  ? RequestSelectionSchemaMap<ReturnType<Declaration>>
  : ReturnType<Declaration> extends Object | null
  ? RequestSelectionSchemaMap<ReturnType<Declaration>>
  : never

/**
 * A particular query / mutation / subscription request properties.
 */
export type RequestItemOptions<
  App extends AnyApplication,
  Declaration extends GraphQLDeclarationItem,
  Selection extends RequestSelectionSchema<App, Declaration>
> = Parameters<Declaration> extends []
  ? ReturnType<Declaration> extends object
    ? {
        select: Selection
      }
    : undefined
  : Declaration extends (args: infer Args) => infer Return
  ? Return extends object
    ? {
        input: Args
        select: Selection
      }
    : {
        input: Args
      }
  : never

/**
 * Request properties for a particular query.
 */
export type RequestQuery<
  App extends AnyApplication,
  Key extends keyof App["_options"]["queries"],
  Declaration extends App["_options"]["queries"][Key],
  Selection extends RequestSelectionSchema<App, App["_options"]["queries"][Key]>
> = {
  selection: Selection
  model: ReturnType<App["_options"]["queries"][Key]>
  type: "query"
  name: Key
  options: RequestItemOptions<App, Declaration, Selection>
}

/**
 * Request properties for a particular mutation.
 */
export type RequestMutation<
  App extends AnyApplication,
  Key extends keyof App["_options"]["mutations"],
  Declaration extends App["_options"]["mutations"][Key],
  Selection extends RequestSelectionSchema<
    App,
    App["_options"]["mutations"][Key]
  >
> = {
  selection: Selection
  model: ReturnType<App["_options"]["mutations"][Key]>
  type: "mutation"
  name: Key
  options: RequestItemOptions<App, Declaration, Selection>
}

/**
 * Request properties for a particular subscription.
 */
export type RequestSubscription<
  App extends AnyApplication,
  Key extends keyof App["_options"]["subscriptions"],
  Declaration extends App["_options"]["mutations"][Key],
  Selection extends RequestSelectionSchema<
    App,
    App["_options"]["subscriptions"][Key]
  >
> = {
  selection: Selection
  model: ReturnType<App["_options"]["subscriptions"][Key]>
  type: "subscription"
  name: Key
  options: RequestItemOptions<App, Declaration, Selection>
}

/**
 * Helper type to represent request query / mutation / subscription.
 */
export type RequestMapItem =
  | RequestQuery<any, any, any, any>
  | RequestMutation<any, any, any, any>
  | RequestSubscription<any, any, any, any>

/**
 * List of request items. Each request is a particular query / mutation / subscription.
 */
export type RequestMap = {
  [name: string]: RequestMapItem
}

/**
 * Core request type.
 * Request is a named object with list of queries / mutations / subscriptions inside.
 */
export type Request<Map extends RequestMap> = {
  typeof: "Request"
  name: string
  map: Map
}

/**
 * Helper type to mark non-selected properties as "never".
 */
export type RequestSelectionKeys<S> = {
  [P in keyof S]: S[P] extends false ? never : P
}[keyof S]

/**
 * Helper type to pick non-never properties of the selection.
 */
export type RequestSelectionPick<B, S> = Pick<
  B,
  { [P in keyof B]: P extends RequestSelectionKeys<S> ? P : never }[keyof B]
>

/**
 * Returns a subset of a model, new type is based on selection.
 */
export type RequestSelection<Model, Selection> = Model extends Object
  ? {
      [P in keyof RequestSelectionPick<
        Model,
        Selection
      >]: Model[P] extends Array<infer U>
        ? RequestSelection<U, Selection[P]>[]
        : Model[P]
    }
  : never

/**
 * Used to determine a ReturnType of a particular request's selection.
 */
export type RequestReturnType<
  T extends Request<any>,
  P extends keyof T["map"]
> = RequestMapItemReturnType<T["map"][P]>

/**
 * Types of the items from the RequestMap.
 */
export type RequestMapReturnType<T extends RequestMap> = {
  [P in keyof T]: RequestMapItemReturnType<T[P]>
}

/**
 * Type of the RequestMapItem.
 */
export type RequestMapItemReturnType<
  T extends RequestMapItem
> = T["model"] extends Array<infer U>
  ? T["model"] extends null
    ? U extends number
      ? U[] | null
      : U extends string
      ? U[] | null
      : U extends boolean
      ? U[] | null
      : RequestSelection<U, T["selection"]>[] | null
    : U extends number
    ? U[]
    : U extends string
    ? U[]
    : U extends boolean
    ? U[]
    : RequestSelection<U, T["selection"]>[]
  : NonNullable<T["model"]> extends number
  ? T["model"]
  : NonNullable<T["model"]> extends string
  ? T["model"]
  : NonNullable<T["model"]> extends boolean
  ? T["model"]
  : T["model"] extends object | null
  ? RequestSelection<NonNullable<T["model"]>, T["selection"]> | null
  : RequestSelection<NonNullable<T["model"]>, T["selection"]>
