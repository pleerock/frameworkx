import {
  AnyApplication,
  Request,
  RequestMap,
  RequestMapReturnType,
} from "@microframework/core"
import ReconnectingWebSocket from "reconnecting-websocket"
import { Observable } from "zen-observable"
import { v4 as uuidv4 } from "uuid"
import { FetcherOptions } from "./fetcher-options-type"
import { FetcherError } from "./fetcher-error-classes"
import { FetcherUtils } from "./fetcher-utils"
import { FetcherErrors } from "./fetcher-errors"
import { Fetcher } from "./fetcher-type"
import { createFetcherQueryBuilder } from "./fetcher-query-builder-factory"

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
    clientId,
    ws: undefined,
    wsConnectionOpened: false,

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
      return this.fetch(app.request((app.action as any)(name, ...args)))
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
              id: this.clientId,
            },
          }),
        )

        // call app pending for a connection callbacks
        this.wsConnectionOpened = true
        for (let item of pendingMessageCallbacks) {
          item.callback()
        }
        pendingMessageCallbacks = []
      }
      this.ws.onclose = () => {}
      this.ws.onmessage = (event) => {
        // console.log(event)
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
        this.wsConnectionOpened = false
      }
      return this
    },

    async fetchUnsafe(
      request: Request<any> | string | any,
      variables?: { [key: string]: any },
      fetchOptions?: RequestInit,
    ): Promise<any> {
      return this.fetch(request, variables, fetchOptions)
    },

    async fetch(
      request: Request<any> | string | any,
      variables?: { [key: string]: any },
      fetchOptions?: RequestInit,
    ): Promise<any> {
      const response = await this.response(request, variables, fetchOptions)
      if (FetcherUtils.isRequestAction(request)) {
        // todo: what about non-json responses?
        const result = await response.json()
        // console.log("result", result)
        return result
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
      fetchOptions?: RequestInit,
    ): Promise<Response> {
      if (FetcherUtils.isRequestAction(request)) {
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
          ...(await FetcherUtils.buildRequestInitOptions(options)),
          ...(fetchOptions || {}),
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
        return fetch(url, {
          method: "POST",
          headers,
          body: JSON.stringify({
            query: queryMeta.body,
            variables,
          }),
          ...(await FetcherUtils.buildRequestInitOptions(options)),
          ...(fetchOptions || {}),
        })
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
      // note: don't use original "id" variable below, since it's value can change within other observes
      const sentData = JSON.stringify({
        id: updatedId,
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
      if (this.wsConnectionOpened) {
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
          if (data.id && data.id === updatedId) {
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
          if (!this.ws) throw FetcherErrors.wsNotConnected()

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
