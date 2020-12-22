jest.mock("reconnecting-websocket")

import { createFetcher, FetcherOptions } from "@microframework/fetcher"
import { createApp } from "@microframework/core"
import { obtainPort } from "../util/test-common"
import { AppServer } from "./fetcher-test-app/server"
import ReconnectingWebSocket from "reconnecting-websocket"
import ws from "ws"

describe("fetcher > factory", () => {
  test("fetcher should have a proper instance", async () => {
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
  })
  test("fetcher without app should lead to undefined app instance in the fetcher", async () => {
    expect(createFetcher({}).app).toBeUndefined()
  })
  test("fetcher created with app should have a given app instance", async () => {
    const app = createApp<{}>()
    expect(createFetcher(app, {}).app).toBe(app)
  })
  test("given fetcher options must be properly set", async () => {
    const app = createApp<{}>()
    const options: FetcherOptions = {
      clientId: "test-fetcher",
      actionEndpoint: "http://localhost/api",
      graphqlEndpoint: "http://localhost/graphql",
      websocketEndpoint: "ws://localhost/subscriptions",
      headersFactory() {
        return { Authorization: "None" }
      },
      websocketOptions: {},
    }
    expect(createFetcher(app, options).options).toBe(options)
  })
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
