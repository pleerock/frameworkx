import { AnyAction, AnyApplication } from "../application"

/**
 * Returns params for the "action" function,
 * based on the application's action signature.
 */
export type ActionFnParams<Action extends AnyAction> = Parameters<
  keyof RequestActionOptions<Action> extends never
    ? () => void
    : (options: RequestActionOptions<Action>) => void
>

/**
 * RequestAction options.
 * Options depend on an application-defined Action.
 */
export type RequestActionOptions<
  Action extends AnyAction
> = (Action["query"] extends object ? { query: Action["query"] } : {}) &
  (Action["params"] extends object ? { params: Action["params"] } : {}) &
  (Action["headers"] extends object
    ? { headers: Partial<Action["headers"]> }
    : {}) &
  (Action["cookies"] extends object ? { cookies: Action["cookies"] } : {}) &
  (Action["body"] extends object ? { body: Action["body"] } : {})

/**
 * All request action options, no matter what action is.
 * Helper type.
 */
export type AllRequestActionOptions = {
  query: any
  params: any
  headers: any
  cookies: any
  body: any
}

/**
 * Request properties for a particular action.
 */
export type RequestAction<
  App extends AnyApplication,
  Key extends keyof App["_options"]["actions"],
  Action extends App["_options"]["actions"][Key]
> = {
  /**
   * Unique type identifier.
   */
  "@type": "RequestAction"

  /**
   * Action name, e.g. GET /users
   */
  name: Key

  /**
   * Request method, e.g. GET, POST, PUT, DELETE, etc.
   */
  method: string

  /**
   * Request path, e.g. /users
   */
  path: string

  /**
   * Action options. Things like params, query params, headers, body, etc.
   */
  options: RequestActionOptions<Action>

  /**
   * Requested application action.
   * Typing helper. Don't use it in a runtime, its value always undefined.
   */
  _action: Action
}

/**
 * Any RequestAction.
 */
export type AnyRequestAction = RequestAction<any, any, any>
