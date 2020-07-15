import { createApplicationServer } from "@microframework/node"
import { createConnection } from "typeorm"
import { obtainPort } from "../../../util/test-common"
import { App } from "../../rate-limits/app"
import { PostEntity } from "./entities"

describe("node > app server options > basic options", () => {
  test("dataSource typeorm connection", async () => {
    const port = await obtainPort()
    const dataSource = await createConnection({
      type: "sqlite",
      database: ":memory:",
    })
    const server = await createApplicationServer(App, {
      appPath: __dirname + "/app",
      webserver: {
        port,
      },
      entities: [PostEntity],
      dataSource,
      resolvers: [],
    })

    await server.start()
    expect(server.dataSource).toBe(dataSource)
    await server.stop()
  })
  test("dataSource factory typeorm connection", async () => {
    const port = await obtainPort()
    const dataSourceFactoryFn = jest.fn()
    const server = await createApplicationServer(App, {
      appPath: __dirname + "/app",
      webserver: {
        port,
      },
      entities: [PostEntity],
      dataSource: dataSourceFactoryFn,
      resolvers: [],
    })

    await server.start()
    expect(dataSourceFactoryFn).toHaveBeenCalled()
    await server.stop()
  })
})
