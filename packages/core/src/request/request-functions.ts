import { AnyApplication } from "../application"
import {
  Request,
  RequestAction,
  RequestMapItemOptions,
  RequestMap,
  AnyRequestAction,
  RequestMapItem,
  RequestSelection,
  ActionFnParams,
} from "./index"

/**
 * Creates a "request action".
 * This object can be utilized by a Request to execute fetch queries.
 */
export function action<
  App extends AnyApplication,
  Name extends keyof App["_options"]["actions"],
  Action extends App["_options"]["actions"][Name]
>(
  app: App,
  name: Name,
  ...args: ActionFnParams<Action>
): RequestAction<App, Name, Action> {
  const [method, ...paths] = (name as string).split(" ")
  return {
    "@type": "RequestAction",
    name,
    method,
    path: paths.join(" "),
    options: args[0] || ({} as any),
    _action: undefined as any,
  }
}

/**
 * Creates a "request query".
 * This object can be utilized by a Request to execute fetch queries.
 */
export function query<
  App extends AnyApplication,
  Name extends keyof App["_options"]["queries"],
  Query extends App["_options"]["queries"][Name],
  Selection extends RequestSelection<Query>
>(
  app: App,
  name: Name,
  options: RequestMapItemOptions<Query, Selection>,
): RequestMapItem<App["_options"]["queries"], Name, Selection> {
  return {
    "@type": "RequestMapItem",
    type: "query",
    name,
    options,
    _selection: undefined as any,
    _model: undefined as any,
  }
}

/**
 * Creates a "request mutation".
 * This object can be utilized by a Request to execute fetch queries.
 */
export function mutation<
  App extends AnyApplication,
  Name extends keyof App["_options"]["mutations"],
  Mutation extends App["_options"]["mutations"][Name],
  Selection extends RequestSelection<Mutation>
>(
  app: App,
  name: Name,
  options: RequestMapItemOptions<Mutation, Selection>,
): RequestMapItem<App["_options"]["mutations"], Name, Selection> {
  return {
    "@type": "RequestMapItem",
    type: "mutation",
    name,
    options,
    _selection: undefined as any,
    _model: undefined as any,
  }
}

/**
 * Creates a "request subscription".
 * This object can be utilized by a Request to execute fetch queries.
 */
export function subscription<
  App extends AnyApplication,
  Name extends keyof App["_options"]["subscriptions"],
  Subscription extends App["_options"]["subscriptions"][Name],
  Selection extends RequestSelection<Subscription>
>(
  app: App,
  name: Name,
  options: RequestMapItemOptions<Subscription, Selection>,
): RequestMapItem<App["_options"]["subscriptions"], Name, Selection> {
  return {
    "@type": "RequestMapItem",
    type: "subscription",
    name,
    options,
    _selection: undefined as any,
    _model: undefined as any,
  }
}

/**
 * Creates an action request.
 */
export function request<T extends AnyRequestAction>(map: T): Request<T>

/**
 * Creates a graphql request.
 */
export function request<T extends RequestMap>(name: string, map: T): Request<T>

/**
 * Creates a request.
 */
export function request<T extends RequestMap | AnyRequestAction>(
  nameOrMap: string | T,
  maybeMap?: T,
): Request<T> {
  return {
    "@type": "Request",
    name: typeof nameOrMap === "string" ? nameOrMap : "",
    map: maybeMap !== undefined ? maybeMap : (nameOrMap as T),
  }
}
