import { createApplicationServer } from "@microframework/node"
import { obtainPort } from "../../../util/test-common"
import { App } from "./app"
import { PostActionResolver } from "./resolvers"
globalThis.fetch = require("node-fetch")

describe("node > app server options > app path json", () => {
  test("server should be able to load metadata from json file", async () => {
    const port = await obtainPort()
    const server = await createApplicationServer(App, {
      appPath: __dirname + "/app",
      webserver: {
        port,
      },
      resolvers: [PostActionResolver],
    })

    await server.start()
    const response = await fetch(`http://localhost:${port}/posts`)
    const result = await response.json()

    expect(result).toMatchObject([
      {
        id: 1,
        title: "Hello",
      },
    ])

    await server.stop()
  })
})
