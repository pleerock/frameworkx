import { createApplicationServer } from "@microframework/node"
import * as ws from "ws"
import { obtainPort } from "../../../util/test-common"
import { App } from "../../rate-limits/app"

describe("node > app server options > websocket options", () => {
  test("extra options", async () => {
    const port = await obtainPort()
    const websocketPort = await obtainPort()
    const server = await createApplicationServer(App, {
      appPath: __dirname + "/app",
      webserver: {
        port,
      },
      websocket: {
        host: "ws://localhost",
        port: websocketPort,
        options: {
          keepAlive: 1000,
        },
      },
      resolvers: [],
    })

    // start a server and check if its running on a port we defined
    await server.start()
    expect(server.websocketServer).toBeDefined()

    const serverSpy = jest.spyOn(ws, "Server")
    expect(serverSpy).toHaveBeenCalledWith({
      host: "ws://localhost",
      path: "/subscriptions",
      port: websocketPort,
      keepAlive: 1000,
    })

    await server.stop()
  })
})
