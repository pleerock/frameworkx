import { createApplicationServer } from "@microframework/node"
import { obtainPort } from "../../../util/test-common"
import { App } from "../../rate-limits/app"

describe("node > app server options > websocket options", () => {
  test("disconnectTimeout", async () => {
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
        disconnectTimeout: 1000,
      },
      resolvers: [],
    })

    await server.start()
    expect(server.properties.websocket.disconnectTimeout).toBe(1000)
    await server.stop()
  })
})
