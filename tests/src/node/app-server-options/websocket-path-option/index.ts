import "../../../util/mock-ws"
import { createApplicationServer } from "@microframework/node"
import { obtainPort, sleep } from "../../../util/test-common"
import { App } from "../../rate-limits/app"
import * as ws from "ws"

describe("node > app server options > websocket options", () => {
  test("path", async () => {
    const port = await obtainPort()
    const websocketPort = await obtainPort()
    const server = await createApplicationServer(App, {
      appPath: __dirname + "/app",
      webserver: {
        port,
      },
      websocket: {
        host: "localhost",
        port: websocketPort,
        path: "websockets",
        websocketServer: ws.Server,
      },
      resolvers: [],
    })
    // start a server and check if its running on a port we defined
    await server.start()
    expect(server.websocketServer).toBeDefined()
    const serverSpy = jest.spyOn(ws, "Server")
    expect(serverSpy).toHaveBeenCalledWith({
      host: "localhost",
      path: "/websockets",
      port: websocketPort,
    })
    await server.stop()
  })
})
