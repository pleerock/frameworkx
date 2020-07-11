import { createApplicationServer } from "@microframework/node"
import { obtainPort } from "../../../util/test-common"
import { TestFetcher } from "../../../util/test-fetcher"
import { App } from "./app"
import { PostActionResolver } from "./resolvers"

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

    const fetcher = new TestFetcher(`http://localhost:${port}/posts`)
    const result = await fetcher.get()

    expect(result).toMatchObject([
      {
        id: 1,
        title: "Hello",
      },
    ])

    await server.stop()
  })
})
