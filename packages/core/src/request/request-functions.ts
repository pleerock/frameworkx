import { AnyApplication } from "../application"
import {
  RequestItemOptions,
  RequestSelectionSchema,
  Request,
  RequestMap,
  RequestMutation,
  RequestQuery,
  RequestSubscription,
} from "./index"

/**
 * Creates a "request query".
 */
export function query<
  App extends AnyApplication,
  QueryKey extends keyof App["_options"]["queries"],
  Declaration extends App["_options"]["queries"][QueryKey],
  Selection extends RequestSelectionSchema<
    App,
    App["_options"]["queries"][QueryKey]
  >
>(
  app: App,
  name: QueryKey,
  options: RequestItemOptions<
    App,
    App["_options"]["queries"][QueryKey],
    Selection
  >,
): RequestQuery<App, QueryKey, Declaration, Selection> {
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
    App,
    App["_options"]["mutations"][MutationKey]
  >
>(
  app: App,
  name: MutationKey,
  options: RequestItemOptions<
    App,
    App["_options"]["mutations"][MutationKey],
    Selection
  >,
): RequestMutation<App, MutationKey, Declaration, Selection> {
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
    App,
    App["_options"]["subscriptions"][SubscriptionKey]
  >
>(
  app: App,
  name: SubscriptionKey,
  options: RequestItemOptions<
    App,
    App["_options"]["subscriptions"][SubscriptionKey],
    Selection
  >,
): RequestSubscription<App, SubscriptionKey, Declaration, Selection> {
  return {
    selection: undefined as any,
    model: undefined as any,
    type: "subscription",
    name,
    options,
  }
}

/**
 * Creates a request.
 */
export function request<T extends RequestMap>(
  name: string,
  map: T,
): Request<T> {
  return {
    name,
    map,
  }
}
