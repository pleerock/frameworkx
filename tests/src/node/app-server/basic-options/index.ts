import { createApplicationServer } from "@microframework/node"
import { obtainPort } from "../../../util/test-common"
import { App } from "../../rate-limits/app"
import express from "express"

describe("node > app server > basic options", () => {
  test("webserver should be created with a specified port", async () => {
    const port = await obtainPort()
    const server = await createApplicationServer(App, {
      appPath: __dirname + "/app",
      webserver: {
        port,
      },
      resolvers: [],
    })

    // make sure express was set by server
    expect(server.express).toBeDefined()
    const listenFn = jest.spyOn(server.express!, "listen")

    // start a server and check if its running on a port we defined
    await server.start()
    expect(listenFn).toHaveBeenCalledWith(port)

    await server.stop()
  })

  test("webserver should be created with a custom express instance", async () => {
    const customExpress = express()
    const port = await obtainPort()
    const server = await createApplicationServer(App, {
      appPath: __dirname + "/app",
      webserver: {
        port,
        express: customExpress,
      },
      resolvers: [],
    })

    // make sure express was set by server
    expect(server.express).toBe(customExpress)
    const listenFn = jest.spyOn(server.express!, "listen")

    // start a server and check
    await server.start()
    expect(listenFn).toHaveBeenCalled()

    await server.stop()
  })
})
