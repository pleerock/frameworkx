import { createApplicationServer } from "@microframework/node"
import { obtainPort } from "../../../util/test-common"
import { App } from "../../rate-limits/app"
import { PostEntity } from "./entities"

describe("node > app server options > basic options", () => {
  test("dataSourceFactory", async () => {
    const port = await obtainPort()
    const dataSourceFactoryFn = jest.fn()
    const server = await createApplicationServer(App, {
      appPath: __dirname + "/app",
      webserver: {
        port,
      },
      entities: [PostEntity],
      dataSourceFactory: dataSourceFactoryFn,
      resolvers: [],
    })

    await server.start()
    expect(dataSourceFactoryFn).toHaveBeenCalled()
    await server.stop()
  })
})
