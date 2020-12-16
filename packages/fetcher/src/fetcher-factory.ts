import {
  AnyApplication,
  Request,
  RequestMap,
  RequestMapReturnType,
} from "@microframework/core"
import ReconnectingWebSocket from "reconnecting-websocket"
import Observable from "zen-observable-ts"
import { v4 as uuidv4 } from "uuid"
import { Fetcher, FetcherOptions } from "./fetcher-core-types"
import { FetcherError } from "./fetcher-error-classes"
import { createFetcherQueryBuilder } from "./fetcher-query-builder-factory"
import { FetcherUtils } from "./fetcher-utils"
import { FetcherErrors } from "./fetcher-errors"

// todo-s:
//  * implement non-json actions
//  * implement file uploads?
//  * implement any http query?

/**
 * Creates a Fetcher that can be used to execute a network requests.
 */
export function createFetcher<App extends AnyApplication>(
  app: App,
  options: FetcherOptions,
): Fetcher<App>

/**
 * Creates a Fetcher that can be used to execute a network requests.
 */
export function createFetcher(options: FetcherOptions): Fetcher<any>

/**
 * Creates a Fetcher that can be used to execute a network requests.
 */
export function createFetcher(
  appOrOptions: AnyApplication | FetcherOptions,
  maybeOptions?: FetcherOptions,
): Fetcher<any> {
  const app: AnyApplication | undefined =
    arguments.length === 2 ? (appOrOptions as AnyApplication) : undefined
  const options: FetcherOptions =
    arguments.length === 1
      ? (appOrOptions as FetcherOptions)
      : (maybeOptions as FetcherOptions)
  const clientId: string = options.clientId || uuidv4()

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

  return {
    "@type": "Fetcher",
    app,
    options,
    ws: undefined,

    query(name: string) {
      if (!app) throw FetcherErrors.noAppToUseOperator("query")

      return createFetcherQueryBuilder(this, {
        "@type": "Request",
        name: name,
        type: "query",
        map: {},
      } as Request<any>)
    },

    mutation(name: string) {
      if (!app) throw FetcherErrors.noAppToUseOperator("mutation")

      return createFetcherQueryBuilder(this, {
        "@type": "Request",
        name: name,
        type: "mutation",
        map: {},
      } as Request<any>)
    },

    subscription(name: string) {
      if (!app) throw FetcherErrors.noAppToUseOperator("subscription")

      return createFetcherQueryBuilder(this, {
        "@type": "Request",
        name: name,
        type: "subscription",
        map: {},
      } as Request<any>)
    },

    action(name: any, ...args: any) {
      if (!app) throw FetcherErrors.noAppToUseOperator("action")

      return this.fetch(app.request((app.action as any)(name, args)))
    },

    async connect() {
      if (!options.websocketEndpoint) {
        throw FetcherErrors.noWebsocketEndpointDefined()
      }
      if (this.ws) {
        throw FetcherErrors.wsAlreadyConnected()
      }

      // create a new websocket instance
      if (options.websocketFactory) {
        this.ws = options.websocketFactory(options) as ReconnectingWebSocket
        if (!this.ws) {
          throw FetcherErrors.websocketFactoryInvalid()
        }
      } else {
        this.ws = new ReconnectingWebSocket(
          options.websocketEndpoint,
          ["graphql-ws"],
          options.websocketOptions,
        )
      }

      // setup websocket callbacks
      this.ws.onopen = () => {
        // send a message about connection being initialized
        this.ws!.send(
          JSON.stringify({
            type: "connection_init",
            payload: {
              id: clientId,
            },
          }),
        )

        // call app pending for a connection callbacks
        wsInitialized = true
        for (let item of pendingMessageCallbacks) {
          item.callback()
        }
        pendingMessageCallbacks = []
      }
      this.ws.onclose = () => {}
      this.ws.onmessage = (event) => {
        for (let onMessageCallback of subscribedMessageCallbacks) {
          onMessageCallback.callback(event)
        }
      }
      return this
    },

    async disconnect() {
      if (this.ws) {
        this.ws.close()
        this.ws = undefined
        wsInitialized = false
      }
      return this
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
      const response = await this.response(request, variables)
      if (FetcherUtils.isRequestAnAction(request)) {
        // todo: what about non-json responses?
        return response.json()
      } else {
        // parse json result
        const result = await response.json()
        if (result["errors"]) {
          const queryMeta = FetcherUtils.extractQueryMetadata(request)
          throw new FetcherError(queryMeta.name, result["errors"])
        }
        return result
      }
    },

    async response(
      request: Request<any> | string | any, // | DocumentNode,
      variables?: { [key: string]: any },
    ): Promise<Response> {
      if (FetcherUtils.isRequestAnAction(request)) {
        if (!options.actionEndpoint) {
          throw FetcherErrors.noActionEndpointDefined()
        }
        if (variables) {
          throw FetcherErrors.variablesNotSupportedInAction()
        }

        // prepare data for a new fetch request
        const headers = await FetcherUtils.buildHeaders(options, request.map)
        const body = FetcherUtils.buildBody(request.map)
        const path = FetcherUtils.buildParamsPath(request.map)
        const query = FetcherUtils.buildQueryString(request.map)
        const url = options.actionEndpoint + path + query
        const method = request.map.method
        return fetch(url, {
          method,
          headers,
          body,
        })
      } else {
        if (!options.graphqlEndpoint) {
          throw FetcherErrors.noGraphQLEndpointDefined()
        }

        // prepare data for a new fetch request
        const queryMeta = FetcherUtils.extractQueryMetadata(request)
        const url = options.graphqlEndpoint + "?" + queryMeta.name
        const headers = await FetcherUtils.buildHeaders(options, undefined)

        // execute fetch request
        const response = await fetch(url, {
          method: "POST",
          headers,
          body: JSON.stringify({
            query: queryMeta.body,
            variables,
          }),
        })

        return response.json()
      }
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
      const queryMeta = FetcherUtils.extractQueryMetadata(query)
      const updatedId = ++id
      const sentData = JSON.stringify({
        id: id,
        name: queryMeta.name,
        type: "start",
        payload: {
          variables,
          query: queryMeta.body,
        },
      })

      const messageSendCallback = () => {
        if (!this.ws) throw FetcherErrors.wsNotConnected()
        // console.log("sentData", sentData)
        this.ws.send(sentData)
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

        return () => {
          const index = subscribedMessageCallbacks.indexOf(
            subscribedMessageCallback,
          )
          if (index !== -1) {
            subscribedMessageCallbacks.splice(index, 1)
          }
          if (!this.ws) {
            throw FetcherErrors.wsNotConnected()
          }

          this.ws.send(
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
