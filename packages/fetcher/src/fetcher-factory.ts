import {
  AnyAction,
  AnyApplication,
  AnyRequestAction,
  Request,
  RequestActionOptions,
  RequestMap,
  RequestMapReturnType,
} from "@microframework/core"
import ReconnectingWebSocket from "reconnecting-websocket"
import Observable from "zen-observable-ts"
import { v4 as uuidv4 } from "uuid"
import { Fetcher, FetcherOptions } from "./fetcher-types"
import { FetcherError } from "./fetcher-error-classes"
import { compile } from "path-to-regexp"
import { createFetcherQueryBuilder } from "./fetcher-builder"
import { extractQueryMetadata } from "./fetcher-utils"

/**
 * Fetcher helps to execute network queries.
 */
export function createFetcher<App extends AnyApplication>(
  app: App,
  options: FetcherOptions,
): Fetcher<App>

/**
 * Fetcher helps to execute network queries.
 */
export function createFetcher(options: FetcherOptions): Fetcher<any>

/**
 * Fetcher helps to execute network queries.
 */
export function createFetcher(
  appOrOptions: AnyApplication | FetcherOptions,
  maybeOptions?: FetcherOptions,
): Fetcher<any> {
  let websocketProtocols: string[] = ["graphql-ws"]
  let ws: ReconnectingWebSocket | undefined = undefined
  let id: number = 0
  let wsInitialized: boolean = false
  let subscribedMessageCallbacks: {
    id: string
    callback: (event: any) => any
  }[] = []
  let pendingMessageCallbacks: {
    id: string
    callback: () => any
  }[] = []

  const app: AnyApplication | undefined =
    arguments.length === 2 ? (appOrOptions as AnyApplication) : undefined
  const options: FetcherOptions =
    arguments.length === 1
      ? (appOrOptions as FetcherOptions)
      : (maybeOptions as FetcherOptions)
  const clientId: string = options.clientId || uuidv4()

  async function buildHeaders() {
    const headers: any = {
      "Content-type": "application/json",
    }
    if (options.headersFactory) {
      const userHeaders = options.headersFactory()
      if (userHeaders["then"] !== undefined) {
        Object.assign(headers, await userHeaders)
      } else {
        Object.assign(headers, userHeaders)
      }
    }
    return headers
  }

  return {
    "@type": "Fetcher",
    app,
    ws,

    async connect() {
      if (options.websocketEndpoint) {
        ws = new ReconnectingWebSocket(
          options.websocketEndpoint,
          websocketProtocols,
          options.websocketOptions,
        )

        ws.onopen = () => {
          ws!.send(
            JSON.stringify({
              type: "connection_init",
              payload: {
                id: clientId,
              },
            }),
          )
          wsInitialized = true
          pendingMessageCallbacks.forEach((item) => {
            item.callback()
          })
          pendingMessageCallbacks = []
          // ws.close()
        }
        ws.onclose = () => {
          // console.log("closed")
        }
        ws.onmessage = (event) => {
          // console.log("onMessage", event)
          for (let onMessageCallback of subscribedMessageCallbacks) {
            onMessageCallback.callback(event)
          }
        }
      }
      return this
    },

    async disconnect() {
      if (ws) {
        ws.close()
      }
      return this
    },

    query(name: string) {
      if (!app) {
        throw new Error(
          `In order to execute an action application instance must be set in the fetcher constructor.`,
        )
      }
      const request: Request<any> = {
        "@type": "Request",
        name: name,
        type: "query",
        map: {},
      }
      return createFetcherQueryBuilder(this, request)
    },

    mutation(name: string) {
      if (!app) {
        throw new Error(
          `In order to execute an action application instance must be set in the fetcher constructor.`,
        )
      }
      const request: Request<any> = {
        "@type": "Request",
        name: name,
        type: "mutation",
        map: {},
      }
      return createFetcherQueryBuilder(this, request)
    },

    subscription(name: string) {
      if (!app) {
        throw new Error(
          `In order to execute an action application instance must be set in the fetcher constructor.`,
        )
      }
      const request: Request<any> = {
        "@type": "Request",
        name: name,
        type: "subscription",
        map: {},
      }
      return createFetcherQueryBuilder(this, request)
    },

    action<ActionKey extends keyof AnyApplication["_options"]["actions"]>(
      name: ActionKey,
      options: RequestActionOptions<
        AnyApplication["_options"]["actions"][ActionKey]
      >,
    ) {
      // todo: implement it same way as Application.action()
      if (!app) {
        throw new Error(
          `In order to execute an action application instance must be set in the fetcher constructor.`,
        )
      }

      return this.fetch(app.request((app.action as any)(name, options))) // todo: remove any
    },

    async fetchUnsafe(
      request: Request<any> | string | any,
      variables?: { [key: string]: any },
    ): Promise<any> {
      return this.fetch(request, variables)
    },

    async fetch(
      request: Request<any> | string | any,
      variables?: { [key: string]: any },
    ): Promise<any> {
      if (
        typeof request === "object" &&
        request.map &&
        request.map["@type"] === "RequestAction"
      ) {
        if (!options.actionEndpoint) {
          throw new Error(
            "`actionEndpoint` must be set in Fetcher options in order to execute requests.",
          )
        }
        const requestAction: AnyRequestAction = request.map
        const headers = await buildHeaders()
        let body: any = undefined
        const actionOptions: AnyAction = requestAction.options
        if (actionOptions.body) {
          body = JSON.stringify(actionOptions.body)
        }

        let path: string = requestAction.path
        if (actionOptions.params) {
          const toPath = compile(path, {
            encode: encodeURIComponent,
          })
          path = toPath(actionOptions.params)
        }

        let query = ""
        if (actionOptions.query) {
          query =
            "?" +
            Object.keys(actionOptions.query)
              .map(
                (k) =>
                  encodeURIComponent(k) +
                  "=" +
                  encodeURIComponent(actionOptions.query[k]),
              )
              .join("&")
        }

        // console.log("executing:", options.actionEndpoint + path + query)
        const response = await fetch(options.actionEndpoint + path + query, {
          method: requestAction.method,
          // todo: send cookies
          headers: headers,
          body,
        })
        // todo: what about non-json responses?
        return response.json()
      } else {
        if (!options.graphqlEndpoint)
          throw new Error(
            "`graphqlEndpoint` must be set in Fetcher options in order to execute GraphQL queries.",
          )

        const { queryName, queryString } = extractQueryMetadata(request)
        const headers = await buildHeaders()
        const response = await fetch(
          options.graphqlEndpoint + "?" + queryName,
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
    },

    async response(
      request: Request<any> | string | any, // | DocumentNode,
      variables?: { [key: string]: any },
    ): Promise<Response> {
      const { queryName, queryString } = extractQueryMetadata(request)
      const headers = await buildHeaders()
      return await fetch(options.graphqlEndpoint + "?" + queryName, {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          query: queryString,
          variables,
        }),
      })
    },

    observeUnsafe<T extends RequestMap>(
      query: Request<T>,
      variables?: { [key: string]: any },
    ): Observable<RequestMapReturnType<T>> {
      return this.observe(query, variables)
    },

    observe(
      query: Request<any> | string | any, // | DocumentNode,
      variables?: { [key: string]: any },
    ): Observable<any> {
      const { queryName, queryString } = extractQueryMetadata(query)
      const updatedId = ++id
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
        if (!ws) throw new Error(`Websocket connection is not established`)
        // console.log("sentData", sentData)
        ws.send(sentData)
      }
      if (wsInitialized) {
        messageSendCallback()
      } else {
        pendingMessageCallbacks.push({
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
        subscribedMessageCallbacks.push(subscribedMessageCallback)
        // console.log(subscribedMessageCallbacks)

        return () => {
          const index = subscribedMessageCallbacks.indexOf(
            subscribedMessageCallback,
          )
          if (index !== -1) {
            // console.trace("splice?")
            subscribedMessageCallbacks.splice(index, 1)
          }
          if (!ws) throw new Error(`Websocket connection is not established`)
          ws.send(
            JSON.stringify({
              id: updatedId,
              type: "stop",
            }),
          )
        }
      })
    },
  }
}
