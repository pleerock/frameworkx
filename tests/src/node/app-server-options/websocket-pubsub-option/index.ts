import { createApplicationServer } from "@microframework/node"
import { PubSub } from "graphql-subscriptions"
import { obtainPort } from "../../../util/test-common"
import { App } from "../../rate-limits/app"

describe("node > app server options > websocket options", () => {
  test("pubsub", async () => {
    const port = await obtainPort()
    const websocketPort = await obtainPort()
    const appPubSub = new PubSub()
    const server = await createApplicationServer(App, {
      appPath: __dirname + "/app",
      webserver: {
        port,
      },
      websocket: {
        host: "ws://localhost",
        port: websocketPort,
        pubSub: appPubSub,
      },
      resolvers: [],
    })

    await server.start()
    expect(server.properties.websocket.pubSub).toBe(appPubSub)
    await server.stop()
  })
})
