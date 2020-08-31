import { Options as WebsocketOptions } from "reconnecting-websocket"

/**
 * Options for Fetcher object.
 */
export type FetcherOptions = {
  /**
   * Endpoint for GraphQL queries.
   */
  graphqlEndpoint: string

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
   * Function that builds and returns request headers.
   */
  headersFactory?: () =>
    | { [key: string]: string }
    | Promise<{ [key: string]: string }>
}
