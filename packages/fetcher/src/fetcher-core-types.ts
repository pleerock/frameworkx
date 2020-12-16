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
 * Executes a network requests.
 * Can be used in the browser, mobile (react native or ionic) or another server.
 * Also can be used to execute cross-server requests in microservices architecture.
 */
export type Fetcher<App extends AnyApplication> = {
  /**
   * Unique type identifier.
   */
  "@type": "Fetcher"

  /**
   * Application used in the fetcher.
   * Undefined if fetcher without application instance specified was created.
   */
  app?: App

  /**
   * Options defined in the fetcher.
   */
  options: FetcherOptions

  /**
   * Reference to a WebSocket connection.
   * Undefined until connection is established.
   */
  ws?: ReconnectingWebSocket

  /**
   * Connects to a websocket.
   */
  connect(): Promise<Fetcher<App>>

  /**
   * Closes opened websocket connection.
   */
  disconnect(): Promise<Fetcher<App>>

  /**
   * Creates a Fetcher Builder to execute a GraphQL query.
   */
  query(name: string): FetcherQueryBuilder<App["_options"]["queries"], {}>

  /**
   * Creates a Fetcher Builder to execute a GraphQL mutation.
   */
  mutation(
    name: string,
  ): FetcherMutationBuilder<App["_options"]["mutations"], {}>

  /**
   * Creates a Fetcher Builder to execute a GraphQL subscription.
   */
  subscription(
    name: string,
  ): FetcherSubscriptionBuilder<App["_options"]["subscriptions"], {}>

  /**
   * Creates a "request action".
   */
  action<
    ActionKey extends keyof App["_options"]["actions"],
    Action extends App["_options"]["actions"][ActionKey]
  >(
    name: ActionKey,
    ...args: ActionFnParams<Action>
  ): Promise<Action["return"]>

  /**
   * Loads data from a server.
   * Returns original type instead of selection.
   */
  fetchUnsafe<T extends AnyRequestAction>(
    request: Request<T>,
  ): Promise<RequestMapOriginType<T>>

  /**
   * Fetches data from a server based on a given Request.
   * Returns original type instead of selection.
   */
  fetchUnsafe<T extends RequestMap>(
    request: Request<T>,
    variables?: { [key: string]: any },
  ): Promise<{ data: RequestMapOriginType<T>; errors?: any[] }>

  /**
   * Fetches data from a server based on a given Request.
   * Returns original type instead of selection.
   */
  fetchUnsafe(
    request: Request<any> | string | any,
    variables?: { [key: string]: any },
  ): Promise<any>

  /**
   * Loads data from a server.
   */
  fetch<T extends AnyRequestAction>(
    request: Request<T>,
  ): Promise<RequestMapReturnType<T>>

  /**
   * Fetches data from a server based on a given Request.
   */
  fetch<T extends RequestMap>(
    request: Request<T>,
    variables?: { [key: string]: any },
  ): Promise<{ data: RequestMapReturnType<T>; errors?: any[] }>

  /**
   * Fetches data from a server based on a given Request.
   */
  fetch<T = any>(
    request: string | any,
    variables?: { [key: string]: any },
  ): Promise<T>

  /**
   * Fetches data from a server based on a given Request.
   */
  fetch(
    request: Request<any> | string | any,
    variables?: { [key: string]: any },
  ): Promise<any>

  /**
   * Loads data from a server.
   */
  response(
    request: Request<any> | string | any, // | DocumentNode,
    variables?: { [key: string]: any },
  ): Promise<Response>

  /**
   * Creates an Observable for a given Subscription.
   * Returns original type instead of selection.
   */
  observeUnsafe<T extends RequestMap>(
    query: Request<T>,
    variables?: { [key: string]: any },
  ): Observable<RequestMapReturnType<T>>

  /**
   * Creates an Observable for a given Subscription.
   */
  observe<T extends RequestMap>(
    query: Request<T>, // | DocumentNode,
    variables?: { [key: string]: any },
  ): Observable<RequestMapReturnType<T>>

  /**
   * Creates an Observable for a given Subscription.
   */
  observe<T>(
    query: string | any, // | DocumentNode,
    variables?: { [key: string]: any },
  ): Observable<T>

  /**
   * Creates an Observable for a given Subscription.
   */
  observe(
    query: Request<any> | string | any, // | DocumentNode,
    variables?: { [key: string]: any },
  ): Observable<any>
}

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
    | { [key: string]: string }
    | Promise<{ [key: string]: string }>
}
