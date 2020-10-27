import { AnyApplication, ApplicationActionMethod } from "../application"
import {
  Request,
  RequestAction,
  RequestGraphQLDeclarationItemOptions,
  RequestMap,
  AnyRequestAction,
  RequestMapItem,
  RequestSelectionSchema,
} from "./index"

/**
 * Creates a "request action".
 */
export function action<
  App extends AnyApplication,
  ActionKey extends keyof App["_options"]["actions"],
  Declaration extends App["_options"]["actions"][ActionKey]
>(
  app: App,
  name: ActionKey,
  ...args: Parameters<ApplicationActionMethod<App["_options"], ActionKey>>
): RequestAction<App, ActionKey, Declaration> {
  const [method, path] = (name as string).split(" ")
  return {
    "@type": "RequestAction",
    _model: undefined,
    name,
    method,
    path,
    options: args[0] || ({} as any),
  }
}

/**
 * Creates a "request query".
 */
export function query<
  App extends AnyApplication,
  QueryKey extends keyof App["_options"]["queries"],
  Declaration extends App["_options"]["queries"][QueryKey],
  Selection extends RequestSelectionSchema<App["_options"]["queries"][QueryKey]>
>(
  app: App,
  name: QueryKey,
  options: RequestGraphQLDeclarationItemOptions<
    App["_options"]["queries"][QueryKey],
    Selection
  >,
): RequestMapItem<App["_options"]["queries"], QueryKey, Selection> {
  return {
    selection: undefined as any,
    model: undefined as any,
    type: "query",
    name,
    options,
  }
}

/**
 * Creates a "request mutation".
 */
export function mutation<
  App extends AnyApplication,
  MutationKey extends keyof App["_options"]["mutations"],
  Declaration extends App["_options"]["mutations"][MutationKey],
  Selection extends RequestSelectionSchema<
    App["_options"]["mutations"][MutationKey]
  >
>(
  app: App,
  name: MutationKey,
  options: RequestGraphQLDeclarationItemOptions<
    App["_options"]["mutations"][MutationKey],
    Selection
  >,
): RequestMapItem<App["_options"]["mutations"], MutationKey, Selection> {
  return {
    selection: undefined as any,
    model: undefined as any,
    type: "mutation",
    name,
    options,
  }
}

/**
 * Creates a "request subscription".
 */
export function subscription<
  App extends AnyApplication,
  SubscriptionKey extends keyof App["_options"]["subscriptions"],
  Declaration extends App["_options"]["subscriptions"][SubscriptionKey],
  Selection extends RequestSelectionSchema<
    App["_options"]["subscriptions"][SubscriptionKey]
  >
>(
  app: App,
  name: SubscriptionKey,
  options: RequestGraphQLDeclarationItemOptions<
    App["_options"]["subscriptions"][SubscriptionKey],
    Selection
  >,
): RequestMapItem<
  App["_options"]["subscriptions"],
  SubscriptionKey,
  Selection
> {
  return {
    selection: undefined as any,
    model: undefined as any,
    type: "subscription",
    name,
    options,
  }
}

/**
 * Creates action request.
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
