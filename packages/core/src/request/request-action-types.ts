import { AnyAction, AnyApplication } from "../application"

/**
 * RequestAction options.
 */
export type RequestActionOptions<
  Action extends AnyAction
> = (Action["query"] extends object ? { query: Action["query"] } : {}) &
  (Action["params"] extends object ? { params: Action["params"] } : {}) &
  (Action["headers"] extends object ? { headers: Action["headers"] } : {}) &
  (Action["cookies"] extends object ? { cookies: Action["cookies"] } : {}) &
  (Action["body"] extends object ? { body: Action["body"] } : {})

/**
 * Any RequestAction.
 */
export type AnyRequestAction = RequestAction<any, any, any>

/**
 * Request properties for a particular action.
 */
export type RequestAction<
  App extends AnyApplication,
  Key extends keyof App["_options"]["actions"],
  Declaration extends App["_options"]["actions"][Key]
> = {
  /**
   * Unique type identifier.
   */
  "@type": "RequestAction"

  /**
   * Model returned by an action.
   * Typing helper. Don't use it in a runtime, its value is always undefined.
   */
  _model: Declaration["return"]

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
  options: RequestActionOptions<Declaration>
}
