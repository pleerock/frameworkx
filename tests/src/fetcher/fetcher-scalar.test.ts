import { scalar } from "@microframework/core"
import { createFetcher, Fetcher } from "@microframework/fetcher"
import { ApplicationServer } from "@microframework/node"
import ws from "ws"
import { obtainPort } from "../util/test-common"
import { App } from "./fetcher-test-app/app"
import { AppServer } from "./fetcher-test-app/server"

describe("fetcher > scalar", () => {
  let webserverPort: number = 0
  let websocketPort: number = 0
  let server: ApplicationServer<any> | undefined = undefined
  let fetcher: Fetcher<any> | undefined = undefined

  beforeEach(async () => {
    webserverPort = await obtainPort()
    websocketPort = await obtainPort()
    server = await AppServer(webserverPort, websocketPort).start()
    fetcher = createFetcher({
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
  })

  afterEach(async () => {
    if (server) {
      await server.stop()
    }
  })

  test("scalar value must be properly sent to the server", async () => {
    const contentRequest = App.requestFn("Posts", {
      content: App.query("content"),
    })

    const result1 = await fetcher!.fetch(
      contentRequest({
        content: {
          type: scalar("post"),
        },
      }),
    )
    expect(result1).toEqual({ data: { content: "post" } })

    const result2 = await fetcher!.fetch(
      contentRequest({
        content: {
          type: scalar("category"),
        },
      }),
    )
    expect(result2).toEqual({ data: { content: "category" } })

    contentRequest({
      content: {
        // @ts-expect-error
        type: scalar("non-exist-type"),
      },
    })
  })
})
