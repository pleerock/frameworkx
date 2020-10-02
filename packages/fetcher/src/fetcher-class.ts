import {
  AnyApplication,
  Request,
  RequestAction,
  RequestActionItemOptions,
  RequestMap,
  RequestMapForAction,
  RequestMapReturnType,
} from "@microframework/core"
import ReconnectingWebSocket from "reconnecting-websocket"
import Observable from "zen-observable-ts"
import { v4 as uuidv4 } from "uuid"
import { FetcherOptions } from "./fetcher-types"
import { FetcherError } from "./fetcher-error-classes"
import { compile } from "path-to-regexp"
import {
  FetcherMutationBuilder,
  FetcherQueryBuilder,
  FetcherSubscriptionBuilder,
} from "./index"
import { createFetcherQueryBuilder } from "./fetcher-builder"
import { extractQueryMetadata } from "./fetcher-utils"
import { RequestMapOriginType } from "@microframework/core"

/**
 * Fetcher helps to execute network queries.
 */
export class Fetcher<App extends AnyApplication = any> {
  private websocketProtocols: string[] = ["graphql-ws"]
  private app: App | undefined
  private options: FetcherOptions
  private clientId: string
  private ws?: ReconnectingWebSocket
  private id: number = 0
  private wsInitialized: boolean = false
  private subscribedMessageCallbacks: {
    id: string
    callback: (event: any) => any
  }[] = []
  private pendingMessageCallbacks: {
    id: string
    callback: () => any
  }[] = []

  constructor(app: App, options: FetcherOptions)
  constructor(options: FetcherOptions)
  constructor(
    appOrOptions: App | FetcherOptions,
    maybeOptions?: FetcherOptions,
  ) {
    const app = arguments.length === 2 ? (appOrOptions as App) : undefined
    const options =
      arguments.length === 1
        ? (appOrOptions as FetcherOptions)
        : (maybeOptions as FetcherOptions)
    this.app = app
    this.options = options
    this.clientId = options.clientId || uuidv4()
    // console.log("options", options)
  }

  /**
   * Connects to a websocket.
   */
  async connect(): Promise<this> {
    if (this.options.websocketEndpoint) {
      this.ws = new ReconnectingWebSocket(
        this.options.websocketEndpoint,
        this.websocketProtocols,
        this.options.websocketOptions,
      )

      this.ws.onopen = () => {
        this.ws!.send(
          JSON.stringify({
            type: "connection_init",
            payload: {
              id: this.clientId,
            },
          }),
        )
        this.wsInitialized = true
        this.pendingMessageCallbacks.forEach((item) => {
          item.callback()
        })
        this.pendingMessageCallbacks = []
        // this.ws.close()
      }
      this.ws.onclose = () => {
        // console.log("closed")
      }
      this.ws.onmessage = (event) => {
        // console.log("onMessage", event)
        for (let onMessageCallback of this.subscribedMessageCallbacks) {
          onMessageCallback.callback(event)
        }
      }
    }
    return this
  }

  /**
   * Closes opened websocket connection.
   */
  async disconnect(): Promise<this> {
    if (this.ws) {
      this.ws.close()
    }
    return this
  }

  /**
   * Creates a Fetcher Builder to execute a GraphQL query.
   */
  query(name: string): FetcherQueryBuilder<App["_options"]["queries"], {}> {
    if (!this.app) {
      throw new Error(
        `In order to execute an action application instance must be set in the fetcher constructor.`,
      )
    }
    const request: Request<any> = {
      typeof: "Request",
      name: name,
      type: "query",
      map: {},
    }
    return createFetcherQueryBuilder(this, request)
  }

  /**
   * Creates a Fetcher Builder to execute a GraphQL mutation.
   */
  mutation(
    name: string,
  ): FetcherMutationBuilder<App["_options"]["mutations"], {}> {
    if (!this.app) {
      throw new Error(
        `In order to execute an action application instance must be set in the fetcher constructor.`,
      )
    }
    const request: Request<any> = {
      typeof: "Request",
      name: name,
      type: "mutation",
      map: {},
    }
    return createFetcherQueryBuilder(this, request)
  }

  /**
   * Creates a Fetcher Builder to execute a GraphQL subscription.
   */
  subscription(
    name: string,
  ): FetcherSubscriptionBuilder<App["_options"]["subscriptions"], {}> {
    if (!this.app) {
      throw new Error(
        `In order to execute an action application instance must be set in the fetcher constructor.`,
      )
    }
    const request: Request<any> = {
      typeof: "Request",
      name: name,
      type: "subscription",
      map: {},
    }
    return createFetcherQueryBuilder(this, request)
  }

  /**
   * Executes an action.
   */
  action<ActionKey extends keyof App["_options"]["actions"]>(
    name: ActionKey,
    options: RequestActionItemOptions<
      App,
      App["_options"]["actions"][ActionKey]
    >,
  ) {
    if (!this.app) {
      throw new Error(
        `In order to execute an action application instance must be set in the fetcher constructor.`,
      )
    }

    return this.fetch(this.app.request(this.app.action(name, options)))
  }

  /**
   * Loads data from a server.
   * Returns original type instead of selection.
   */
  async fetchUnsafe<T extends RequestMapForAction>(
    request: Request<T>,
  ): Promise<RequestMapOriginType<T>>

  /**
   * Fetches data from a server based on a given Request.
   * Returns original type instead of selection.
   */
  async fetchUnsafe<T extends RequestMap>(
    request: Request<T>,
    variables?: { [key: string]: any },
  ): Promise<{ data: RequestMapOriginType<T>; errors?: any[] }>

  /**
   * Fetches data from a server based on a given Request.
   * Returns original type instead of selection.
   */
  async fetchUnsafe(
    request: Request<any> | string | any,
    variables?: { [key: string]: any },
  ): Promise<any> {
    return this.fetch(request, variables)
  }

  /**
   * Loads data from a server.
   */
  async fetch<T extends RequestMapForAction>(
    request: Request<T>,
  ): Promise<RequestMapReturnType<T>>

  /**
   * Fetches data from a server based on a given Request.
   */
  async fetch<T extends RequestMap>(
    request: Request<T>,
    variables?: { [key: string]: any },
  ): Promise<{ data: RequestMapReturnType<T>; errors?: any[] }>

  /**
   * Fetches data from a server based on a given Request.
   */
  async fetch<T = any>(
    request: string | any,
    variables?: { [key: string]: any },
  ): Promise<T>

  /**
   * Fetches data from a server based on a given Request.
   */
  async fetch(
    request: Request<any> | string | any,
    variables?: { [key: string]: any },
  ): Promise<any> {
    if (
      typeof request === "object" &&
      request.map &&
      request.map.type === "action"
    ) {
      if (!this.options.actionEndpoint) {
        throw new Error(
          "`actionEndpoint` must be set in Fetcher options in order to execute requests.",
        )
      }
      const requestAction: RequestAction<any, any, any> = request.map
      let [method, path] = requestAction.name.split(" ")
      const headers = await this.buildHeaders()
      let body: any = undefined
      if (requestAction.options.body) {
        body = JSON.stringify(requestAction.options.body)
      }

      if (requestAction.options.params) {
        const toPath = compile(path, { encode: encodeURIComponent })
        path = toPath(requestAction.options.params)
      }

      let query = ""
      if (requestAction.options.query) {
        query =
          "?" +
          Object.keys(requestAction.options.query)
            .map(
              (k) =>
                encodeURIComponent(k) +
                "=" +
                encodeURIComponent(requestAction.options.query[k]),
            )
            .join("&")
      }

      // console.log("executing:", this.options.actionEndpoint + path + query)
      const response = await fetch(this.options.actionEndpoint + path + query, {
        method: method,
        // todo: send cookies
        headers: headers,
        body,
      })
      // todo: what about non-json responses?
      return response.json()
    } else {
      if (!this.options.graphqlEndpoint)
        throw new Error(
          "`graphqlEndpoint` must be set in Fetcher options in order to execute GraphQL queries.",
        )

      const { queryName, queryString } = extractQueryMetadata(request)
      const headers = await this.buildHeaders()
      const response = await fetch(
        this.options.graphqlEndpoint + "?" + queryName,
        {
          method: "POST",
          headers: headers,
          body: JSON.stringify({
            query: queryString,
            variables,
          }),
        },
      )
      const result = await response.json()
      if (result["errors"]) {
        throw new FetcherError(queryName, result["errors"])
      }
      return result // .data
    }
  }

  /**
   * Loads data from a server.
   */
  async response(
    request: Request<any> | string | any, // | DocumentNode,
    variables?: { [key: string]: any },
  ): Promise<Response> {
    const { queryName, queryString } = extractQueryMetadata(request)
    const headers = await this.buildHeaders()
    return await fetch(this.options.graphqlEndpoint + "?" + queryName, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        query: queryString,
        variables,
      }),
    })
  }

  /**
   * Creates an Observable for a given Subscription.
   * Returns original type instead of selection.
   */
  observeUnsafe<T extends RequestMap>(
    query: Request<T>,
    variables?: { [key: string]: any },
  ): Observable<RequestMapReturnType<T>> {
    return this.observe(query, variables)
  }

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
  ): Observable<any> {
    const { queryName, queryString } = extractQueryMetadata(query)
    const id = ++this.id
    const sentData = JSON.stringify({
      id: id,
      name: queryName,
      type: "start",
      payload: {
        variables,
        query: queryString,
      },
    })

    let messageSendCallback = () => {
      if (!this.ws) throw new Error(`Websocket connection is not established`)
      // console.log("sentData", sentData)
      this.ws.send(sentData)
    }
    if (this.wsInitialized) {
      messageSendCallback()
    } else {
      this.pendingMessageCallbacks.push({
        id: sentData,
        callback: messageSendCallback,
      })
    }

    return new Observable<any>((observer: any) => {
      const onMessageCallback = (event: any) => {
        // console.log("got a message", event)
        const data = JSON.parse(event.data)
        if (data.payload) {
          if (data.type === "error") {
            observer.error(data.payload)
            return
          }
          // if (data.payload.data) {
          // this check is temporary and based only on query name
          // need to re-implement with real query ids

          // console.log(name, data.payload.data)
          // const dataName = Object.keys(data.payload.data)[0]
          // if (data.payload.data[dataName]) {
          if (data.payload.data) {
            observer.next(data.payload.data)
          }
          if (data.payload.errors) {
            observer.error(data.payload)
          }
        }
      }
      const subscribedMessageCallback = {
        id: sentData,
        callback: onMessageCallback,
      }
      this.subscribedMessageCallbacks.push(subscribedMessageCallback)
      // console.log(this.subscribedMessageCallbacks)

      return () => {
        const index = this.subscribedMessageCallbacks.indexOf(
          subscribedMessageCallback,
        )
        if (index !== -1) {
          // console.trace("splice?")
          this.subscribedMessageCallbacks.splice(index, 1)
        }
        if (!this.ws) throw new Error(`Websocket connection is not established`)
        this.ws.send(
          JSON.stringify({
            id: id,
            type: "stop",
          }),
        )
      }
    })
  }

  private async buildHeaders() {
    const headers: any = {
      "Content-type": "application/json",
    }
    if (this.options.headersFactory) {
      const userHeaders = this.options.headersFactory()
      if (userHeaders["then"] !== undefined) {
        Object.assign(headers, await userHeaders)
      } else {
        Object.assign(headers, userHeaders)
      }
    }
    return headers
  }
}
