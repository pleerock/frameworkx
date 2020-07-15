import { createApplicationServer } from "@microframework/node"
import { obtainPort, sleep } from "../../../util/test-common"
import { App } from "../../rate-limits/app"
import * as ws from "ws"

describe("node > app server options > websocket options", () => {
  test("host and port", async () => {
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
    })

    await server.stop()
  })
})
