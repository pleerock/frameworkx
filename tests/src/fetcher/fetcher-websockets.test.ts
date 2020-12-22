jest.mock("reconnecting-websocket")

import { AppServer } from "./fetcher-test-app/server"
import { App } from "./fetcher-test-app/app"
import { createFetcher } from "@microframework/fetcher"
import { obtainPort } from "../util/test-common"
import ReconnectingWebSocket from "reconnecting-websocket"
import ws from "ws"

describe("fetcher > websockets", () => {
  test("'connection_init' message must be sent on connection open", async () => {
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
  test("subscribers must receive a message on message income", async () => {
    const webserverPort = await obtainPort()
    const websocketPort = await obtainPort()
    const server = await AppServer(webserverPort, websocketPort).start()
    const fetcher = createFetcher(App, {
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
    await fetcher.connect()

    // subscribe to a data changes
    const subscriptionCallback = jest.fn()
    const subscription1 = fetcher
      .subscription("OnPostCreate")
      .add("post")
      .postCreated()
      .select({
        id: true,
      })
      .observe()
      .subscribe((data) => {
        subscriptionCallback(data)
      })
    const subscription2 = fetcher
      .subscription("OnPostCreate")
      .add("post")
      .postCreated()
      .select({
        id: true,
      })
      .observe()
      .subscribe((data) => {
        subscriptionCallback(data)
      })
    const subscription3 = fetcher
      .subscription("OnPostRemove")
      .add("post")
      .postRemoved()
      .select({
        id: true,
      })
      .observe()
      .subscribe((data) => {
        subscriptionCallback(data)
      })

    // fake-deliver the message
    fetcher.ws!.onmessage!({
      data: JSON.stringify({ id: 1, payload: { data: { post: { id: 555 } } } }),
    } as MessageEvent)
    fetcher.ws!.onmessage!({
      data: JSON.stringify({ id: 2, payload: { data: { post: { id: 555 } } } }),
    } as MessageEvent)

    // make sure subscription received the message
    expect(subscriptionCallback).toBeCalledTimes(2)
    expect(subscriptionCallback).toBeCalledWith({ post: { id: 555 } })

    await subscription1.unsubscribe()
    await subscription2.unsubscribe()
    await subscription3.unsubscribe()
    await fetcher.disconnect()
  })
  test("subscribers must receive a messages even if subscription was registered before connection established", async () => {})
  test("'start' message must be sent to the server on client subscription", async () => {})
  test("'stop' message must be sent to the server on unsubscription", async () => {})
  test("'connection_init' message must be sent on websocket connection open", async () => {})
  test("provided clientId should be sent in 'connection_init' payload", async () => {})
  test("auto-generated clientId should be sent in 'connection_init' payload", async () => {})
})
