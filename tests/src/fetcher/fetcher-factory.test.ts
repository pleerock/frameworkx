jest.mock("reconnecting-websocket")

import { createFetcher, FetcherOptions } from "@microframework/fetcher"
import { createApp } from "@microframework/core"
import { obtainPort } from "../util/test-common"
import { AppServer } from "./fetcher-test-app/server"
import ReconnectingWebSocket from "reconnecting-websocket"
import ws from "ws"

describe("fetcher > factory", () => {
  describe("createFetcher", () => {
    test("should return a proper Fetcher type", async () => {
      const fetcher = createFetcher({})
      expect(fetcher["@type"]).toBe("Fetcher")
      expect(fetcher.query).toBeInstanceOf(Function)
      expect(fetcher.mutation).toBeInstanceOf(Function)
      expect(fetcher.subscription).toBeInstanceOf(Function)
      expect(fetcher.action).toBeInstanceOf(Function)
      expect(fetcher.fetchUnsafe).toBeInstanceOf(Function)
      expect(fetcher.fetch).toBeInstanceOf(Function)
      expect(fetcher.response).toBeInstanceOf(Function)
      expect(fetcher.observeUnsafe).toBeInstanceOf(Function)
      expect(fetcher.observe).toBeInstanceOf(Function)
      expect(fetcher.wsConnectionOpened).toEqual(false)
    })
    test("creating without app should lead to undefined app instance in the fetcher", async () => {
      expect(createFetcher({}).app).toBeUndefined()
    })
    test("creating with app should provide a given app instance", async () => {
      const app = createApp()
      expect(createFetcher(app, {}).app).toBe(app)
    })
    test("given fetcher options must be properly set", async () => {
      const app = createApp()
      const options: FetcherOptions = {
        clientId: "test-fetcher",
        actionEndpoint: "http://localhost/api",
        graphqlEndpoint: "http://localhost/graphql",
        websocketEndpoint: "ws://localhost/subscriptions",
        headersFactory: async () => {
          return { Authorization: "None" }
        },
        websocketOptions: {},
      }
      expect(createFetcher(app, options).options).toBe(options)
    })

    test("error should be thrown if methods relying on 'app' called when no app specified", async () => {
      const fetcher = createFetcher({})

      expect(() => fetcher.query("bla")).toThrowError(
        `Application instance must be set in the Fetcher in order to use "query" operator.`,
      )
      expect(() => fetcher.mutation("bla")).toThrowError(
        `Application instance must be set in the Fetcher in order to use "mutation" operator.`,
      )
      expect(() => fetcher.subscription("bla")).toThrowError(
        `Application instance must be set in the Fetcher in order to use "subscription" operator.`,
      )
      expect(() => fetcher.action("bla")).toThrowError(
        `Application instance must be set in the Fetcher in order to use "action" operator.`,
      )
    })
  })

  describe("FetcherOptions", () => {
    test("WebSocket instance must be properly set in the fetcher", async () => {
      const webserverPort = await obtainPort()
      const websocketPort = await obtainPort()
      const server = await AppServer(webserverPort, websocketPort).start()
      const fetcher = createFetcher({
        clientId: "jest-test-fetcher",
        actionEndpoint: `http://localhost:${webserverPort}`,
        graphqlEndpoint: `http://localhost:${webserverPort}/graphql`,
        websocketEndpoint: `ws://localhost:${websocketPort}/subscriptions`,
        websocketOptions: {
          WebSocket: ws,
          connectionTimeout: 1000,
          maxRetries: 10,
        },
      })

      expect(fetcher.ws).toBeUndefined()
      await fetcher.connect()
      expect(fetcher.ws).not.toBeUndefined()
      await fetcher.disconnect()
      expect(fetcher.ws).toBeUndefined()
      await server.stop()
    })
    test("WebSocket factory can be used to create a custom websocket instance", async () => {
      const fetcher = createFetcher({
        clientId: "jest-test-fetcher",
        websocketEndpoint: "ws://localhost",
        websocketFactory: (options) => {
          return new ReconnectingWebSocket(`ws://localhost:12345/subscriptions`)
        },
      })

      await fetcher.connect()
      expect(ReconnectingWebSocket).toHaveBeenCalledWith(
        `ws://localhost:12345/subscriptions`,
      )
      await fetcher.disconnect()
    })
  })

  describe("Fetcher.connect", () => {
    test("should throw an error if called twice", async () => {
      const fetcher = createFetcher({
        clientId: "jest-test-fetcher",
        websocketEndpoint: "ws://localhost",
        websocketFactory: (options) => {
          return new ReconnectingWebSocket(`ws://localhost:12345/subscriptions`)
        },
      })

      // connect and disconnect just to make sure everything works properly
      await fetcher.connect()
      await fetcher.disconnect()

      // connect again, this shouldn't give an error
      await fetcher.connect()

      // and connect once again without disconnection, it should give an error
      expect(() => fetcher.connect()).rejects.toThrowError(
        `WebSocket connection is already established.`,
      )
    })
    test("should throw an error if websocketEndpoint wasn't defined", async () => {
      const fetcher = createFetcher({
        clientId: "jest-test-fetcher",
        websocketFactory: (options) => {
          return new ReconnectingWebSocket(`ws://localhost:12345/subscriptions`)
        },
      })

      // and connect once again without disconnection, it should give an error
      expect(() => fetcher.connect()).rejects.toThrowError(
        `"websocketEndpoint" must be defined in the Fetcher options in order to establish a WebSocket connection.`,
      )
    })
    test("should throw an error if websocketFactory provided invalid object", async () => {
      const fetcher = createFetcher({
        clientId: "jest-test-fetcher",
        websocketEndpoint: "ws://localhost",
        websocketFactory: (options) => {
          return null
        },
      })

      // and connect once again without disconnection, it should give an error
      expect(() => fetcher.connect()).rejects.toThrowError(
        `"websocketFactory" passed in the options to Fetcher returned invalid WebSocket instance.`,
      )
    })
  })
  describe("Fetcher.disconnect", () => {
    test("should reset 'ws' and 'wsConnectionOpened' flags on disconnection", async () => {
      const fetcher = createFetcher({
        clientId: "jest-test-fetcher",
        websocketEndpoint: "ws://localhost",
        websocketFactory: (options) => {
          return new ReconnectingWebSocket(`ws://localhost:12345/subscriptions`)
        },
      })

      await fetcher.connect()
      expect(fetcher.ws).toBeTruthy()

      await fetcher.disconnect()
      expect(fetcher.ws).toBeFalsy()
      expect(fetcher.wsConnectionOpened).toEqual(false)
    })
  })
})
