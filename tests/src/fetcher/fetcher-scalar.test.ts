import { Scalars } from "@microframework/core"
import { createFetcher, Fetcher } from "@microframework/fetcher"
import { ApplicationServer } from "@microframework/node"
import ws from "ws"
import { obtainPort } from "../util/test-common"
import { App } from "./fetcher-test-app/app"
import { AppServer } from "./fetcher-test-app/server"

describe("fetcher > scalar functions", () => {
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

  test("scalar enum value must be properly sent to the server", async () => {
    const contentRequest = App.requestFn("Posts", {
      content: App.query("content"),
    })

    const result1 = await fetcher!.fetch(
      contentRequest({
        content: {
          type: Scalars.enum("post"),
        },
      }),
    )
    expect(result1).toEqual({ data: { content: "post" } })

    const result2 = await fetcher!.fetch(
      contentRequest({
        content: {
          type: Scalars.enum("category"),
        },
      }),
    )
    expect(result2).toEqual({ data: { content: "category" } })

    contentRequest({
      content: {
        // @ts-expect-error
        type: Scalars.enum("non-exist-type"),
      },
    })
  })

  test("scalar Date value must be properly sent to the server", async () => {
    const contentRequest = App.requestFn("Posts", {
      contentByDate: App.query("contentByDate"),
    })

    const result1 = await fetcher!.fetch(
      contentRequest({
        contentByDate: {
          date: Scalars.date(new Date("2017-01-10T21:33:15.233Z")),
        },
      }),
    )

    expect(result1).toEqual({ data: { contentByDate: "2017-01-10" } })
  })

  test("scalar Time value must be properly sent to the server", async () => {
    const contentRequest = App.requestFn("Posts", {
      contentByTime: App.query("contentByTime"),
    })

    const result1 = await fetcher!.fetch(
      contentRequest({
        contentByTime: {
          date: Scalars.time(new Date("2017-01-10T21:33:15.233Z")),
        },
      }),
    )

    expect(result1).toEqual({
      data: {
        contentByTime: "21:33:15.233Z",
      },
    })
  })

  test("scalar DateTime value must be properly sent to the server", async () => {
    const contentRequest = App.requestFn("Posts", {
      contentByDateTime: App.query("contentByDateTime"),
    })

    const result1 = await fetcher!.fetch(
      contentRequest({
        contentByDateTime: {
          date: Scalars.dateTime(new Date("2017-01-10T21:33:15.233Z")),
        },
      }),
    )

    expect(result1).toEqual({
      data: {
        contentByDateTime: "2017-01-10T21:33:15.233Z",
      },
    })
  })
})
