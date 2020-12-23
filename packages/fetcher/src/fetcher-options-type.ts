import ReconnectingWebSocket, {
  Options as WebsocketOptions,
} from "reconnecting-websocket"
import {
  ActionFnParams,
  AnyApplication,
  AnyRequestAction,
  Request,
  RequestMap,
  RequestMapOriginType,
  RequestMapReturnType,
} from "@microframework/core"
import Observable from "zen-observable-ts"
import {
  FetcherMutationBuilder,
  FetcherQueryBuilder,
  FetcherSubscriptionBuilder,
} from "./index"

/**
 * Options for Fetcher object.
 */
export type FetcherOptions = {
  /**
   * Endpoint for action queries.
   */
  actionEndpoint?: string

  /**
   * Endpoint for GraphQL queries.
   */
  graphqlEndpoint?: string

  /**
   * Endpoint for GraphQL websocket queries.
   */
  websocketEndpoint?: string

  /**
   * Unique client id. Used to represent unique client id for websocket connections.
   * If not specified, randomly generated uuid will be used.
   */
  clientId?: string

  /**
   * Extra websocket options.
   */
  websocketOptions?: WebsocketOptions

  /**
   * A custom factory to create a WebSocket instance.
   * Can be used if using ReconnectingWebSocket isn't acceptable,
   * or specific configuration is required.
   */
  websocketFactory?: (options: FetcherOptions) => ReconnectingWebSocket | any

  /**
   * Function that builds and returns request headers.
   */
  headersFactory?: () =>
    | { [key: string]: any }
    | Promise<{ [key: string]: any }>
}
