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
import Observable from "zen-observable"
import { v4 as uuidv4 } from "uuid"
import { FetcherOptions } from "./FetcherOptions"
import { FetcherError } from "./FetcherError"
import { compile } from "path-to-regexp"
import { FetcherMutationBuilder, FetcherQueryBuilder, FetcherSubscriptionBuilder, } from "./index"
import { FetcherBuilderExecutor } from "./fetcher-builder"

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
    return FetcherBuilderExecutor(this, request)
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
    return FetcherBuilderExecutor(this, request)
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
    return FetcherBuilderExecutor(this, request)
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

      const { queryName, queryString } = this.extractQueryMetadata(request)
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
    const { queryName, queryString } = this.extractQueryMetadata(request)
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

  observe<T extends RequestMap>(
    query: Request<T>, // | DocumentNode,
    variables?: { [key: string]: any },
  ): Observable<RequestMapReturnType<T>>
  observe<T>(
    query: string | any, // | DocumentNode,
    variables?: { [key: string]: any },
  ): Observable<T>
  observe(
    query: Request<any> | string | any, // | DocumentNode,
    variables?: { [key: string]: any },
  ): Observable<any> {
    const { queryName, queryString } = this.extractQueryMetadata(query)
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

  private extractQueryMetadata(request: Request<any> | string | any) {
    let queryName = ""
    let queryString = ""
    if (typeof request === "string") {
      queryString = request
    } else if (request["typeof"] === "Request") {
      queryName = request.name
      queryString = this.requestToQuery(request as Request<any>)
    } else if (
      (request as any)["definitions"] !== undefined ||
      (request as any)["loc"] !== undefined
    ) {
      // console.log(request)
      if ((request as any)["definitions"]) {
        queryName = (request as any)["definitions"]
          .filter((def: any) => !!(def as any)["name"])
          .map((def: any) => (def as any)["name"]["value"])
          .join(",")
      }
      if ((request as any)["loc"]) {
        queryString = (request as any)["loc"].source.body
      }
    }
    return { queryName, queryString }
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

  private serializeInput(input: any, nestingLevel: number) {
    let query = ""
    for (let key in input) {
      if (Array.isArray(input[key])) {
        query += `${"  ".repeat(nestingLevel + 1)}${key}: [${input[key]
          .map((item: any) => {
            let subQuery = ""
            if (item === null || item === undefined) {
              subQuery += "null"
            } else if (typeof item === "object") {
              subQuery += `{\r\n${this.serializeInput(
                item,
                nestingLevel + 1,
              )}${"  ".repeat(nestingLevel + 1)}}`
            } else {
              subQuery += JSON.stringify(item)
            }
            return subQuery
          })
          .join(", ")}]\r\n`
      } else if (input[key] === null || input[key] === undefined) {
        query += `${"  ".repeat(nestingLevel + 1)}${key}: null\r\n`
      } else if (typeof input[key] === "object") {
        query += `${"  ".repeat(
          nestingLevel + 1,
        )}${key}: {\r\n${this.serializeInput(
          input[key],
          nestingLevel + 1,
        )}${"  ".repeat(nestingLevel + 1)}}\r\n`
      } else {
        query += `${"  ".repeat(nestingLevel + 1)}${key}: ${JSON.stringify(
          input[key],
        )}\r\n`
      }
    }
    return query
  }

  private serializeSelect(select: any, nestingLevel: number) {
    let query = "{\r\n"
    for (let key in select) {
      if (select[key] === true) {
        query += `${"  ".repeat(nestingLevel + 1)}${key}\r\n`
      } else if (typeof select[key] === "object") {
        query += `${"  ".repeat(nestingLevel + 1)}${key} ${this.serializeSelect(
          select[key],
          nestingLevel + 1,
        )}`
      }
    }
    query += `${"  ".repeat(nestingLevel)}}\r\n`
    return query
  }

  private requestToQuery(request: Request<any>): string {
    const isQuery =
      request.type === "query" ||
      Object.keys(request.map).some((key) => request.map[key].type === "query")
    const isMutation =
      request.type === "mutation" ||
      Object.keys(request.map).some(
        (key) => request.map[key].type === "mutation",
      )
    const isSubscription =
      request.type === "subscription" ||
      Object.keys(request.map).some(
        (key) => request.map[key].type === "subscription",
      )
    const isMixed =
      [isQuery, isMutation, isSubscription].filter((bool) => bool === true)
        .length > 1
    if (isMixed)
      throw new Error(
        `A single request can't mix queries, mutations and subscriptions.`,
      )

    let query = ""
    if (isQuery) {
      query += `query `
    } else if (isMutation) {
      query += `mutation `
    } else if (isSubscription) {
      query += `subscription `
    }
    query += `${request.name} {\r\n`
    for (let key in request.map) {
      query += `  ${key}: ${request.map[key].name}`
      if (request.map[key].options.input) {
        query += `(\r\n${this.serializeInput(
          request.map[key].options.input,
          1,
        )}  )`
      }
      if (request.map[key].options.select) {
        query += " " + this.serializeSelect(request.map[key].options.select, 1)
      }
    }
    // query += " " + this.transform(options.select)
    query += "}\r\n"
    // console.log(query)
    return query
  }
}
