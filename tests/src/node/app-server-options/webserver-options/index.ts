import { createApplicationServer } from "@microframework/node"
import { obtainPort } from "../../../util/test-common"
import express from "express"
import cors from "cors"
import { App } from "./app"
import Mock = jest.Mock

describe("node > app server options > webserver options", () => {
  beforeEach(() => {
    ;(cors as Mock).mockClear()
  })

  test("port", async () => {
    const port = await obtainPort()
    const server = await createApplicationServer(App, {
      appPath: __dirname + "/app",
      webserver: {
        port,
      },
      resolvers: [],
    })

    // make sure option property was set
    expect(server.express).toBeDefined()
    const listenFn = jest.spyOn(server.express!, "listen")

    // start a server and check if its running on a port we defined
    await server.start()
    expect(listenFn).toHaveBeenCalledWith(port)

    await server.stop()
  })

  test("custom express", async () => {
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

    // make sure option property was set
    expect(server.express).toBe(customExpress)
    const listenFn = jest.spyOn(server.express!, "listen")

    // start a server and check
    await server.start()
    expect(listenFn).toHaveBeenCalled()

    await server.stop()
  })

  test("cors set to true", async () => {
    const port = await obtainPort()
    const server = await createApplicationServer(App, {
      appPath: __dirname + "/app",
      webserver: {
        port,
        cors: true,
      },
      resolvers: [],
    })

    // make sure option property was set
    expect(server.properties.webserver.cors).toBe(true)

    // start a server and check
    await server.start()
    expect(cors).toHaveBeenCalled()

    await server.stop()
  })

  test("cors set to false", async () => {
    const port = await obtainPort()
    const server = await createApplicationServer(App, {
      appPath: __dirname + "/app",
      webserver: {
        port,
        cors: false,
      },
      resolvers: [],
    })

    // make sure option property was set
    expect(server.properties.webserver.cors).toBe(false)

    // start a server and check
    await server.start()
    expect(cors).not.toHaveBeenCalled()

    await server.stop()
  })

  test("cors with options", async () => {
    const corsOptions = {
      maxAge: 12345,
    }
    const port = await obtainPort()
    const server = await createApplicationServer(App, {
      appPath: __dirname + "/app",
      webserver: {
        port,
        cors: corsOptions,
      },
      resolvers: [],
    })

    // make sure option property was set
    expect(server.properties.webserver.cors).toMatchObject(corsOptions)

    // start a server and check
    await server.start()
    expect(cors).toHaveBeenCalledWith(corsOptions)

    await server.stop()
  })

  test("static dirs", async () => {
    const staticDirs = {
      "/uploads": "uploads",
    }
    const port = await obtainPort()
    const server = await createApplicationServer(App, {
      appPath: __dirname + "/app",
      webserver: {
        port,
        staticDirs,
      },
      resolvers: [],
    })

    // make sure option property was set
    expect(server.properties.webserver.staticDirs).toMatchObject(staticDirs)
    const useFn = jest.spyOn(server.express!, "use")
    const staticFn = jest.spyOn(express, "static")

    // start a server and check
    await server.start()
    expect(staticFn).toHaveBeenCalledWith("uploads")
    expect(useFn).toHaveBeenCalledWith("/uploads", expect.anything())

    await server.stop()
  })

  test("custom middleware", async () => {
    const middleware1 = (req: any, res: any, next: any) => next()
    const middleware2 = (req: any, res: any, next: any) => next()
    const port = await obtainPort()
    const server = await createApplicationServer(App, {
      appPath: __dirname + "/app",
      webserver: {
        port,
        middlewares: [middleware1, middleware2],
      },
      resolvers: [],
    })

    // make sure option property was set
    expect(server.properties.webserver.middlewares).toMatchObject([
      middleware1,
      middleware2,
    ])
    const useFn = jest.spyOn(server.express!, "use")

    // start a server and check
    await server.start()
    expect(useFn).toHaveBeenCalledWith(middleware1)
    expect(useFn).toHaveBeenCalledWith(middleware2)

    await server.stop()
  })
  test("custom action middleware", async () => {
    const middleware1 = (req: any, res: any, next: any) => next()
    const middleware2 = (req: any, res: any, next: any) => next()
    const port = await obtainPort()
    const server = await createApplicationServer(App, {
      appPath: __dirname + "/app",
      webserver: {
        port,
        actionMiddleware: {
          "get /posts": [middleware1],
          "post /posts": [middleware2],
        },
      },
      resolvers: [],
    })

    // make sure option property was set
    expect(server.properties.webserver.actionMiddleware).toMatchObject({
      "get /posts": [middleware1],
      "post /posts": [middleware2],
    })
    const getFn = jest.spyOn(server.express!, "get")
    const postFn = jest.spyOn(server.express!, "post")

    // start a server and check
    await server.start()

    expect(getFn).toHaveBeenCalledWith("/posts", middleware1, expect.anything())
    expect(getFn).not.toHaveBeenCalledWith(
      "/posts",
      middleware2,
      expect.anything(),
    )

    expect(postFn).toHaveBeenCalledWith(
      "/posts",
      middleware2,
      expect.anything(),
    )
    expect(postFn).not.toHaveBeenCalledWith(
      "/posts",
      middleware1,
      expect.anything(),
    )

    await server.stop()
  })
})
