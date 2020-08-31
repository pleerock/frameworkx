import { createApplicationServer } from "@microframework/node"
import { Fetcher } from "@microframework/fetcher"
import gql from "graphql-tag"
import { obtainPort } from "../../../util/test-common"
import { App } from "../../rate-limits/app"
import { PostResolver } from "./resolvers"

describe("node > app server options > graphql options", () => {
  test("custom route", async () => {
    const port = await obtainPort()
    const server = await createApplicationServer(App, {
      appPath: __dirname + "/app",
      webserver: {
        port,
      },
      graphql: {
        route: "/api",
      },
      resolvers: [PostResolver],
    }).start()

    // make sure option property was set
    expect(server.properties.graphql.route).toBe("/api")

    const fetcher = new Fetcher({
      graphqlEndpoint: `http://localhost:${port}/api`,
    })
    const query = gql`
      query {
        post(id: 1) {
          id
          title
        }
      }
    `
    const result = await fetcher!.fetch(query)
    expect(result).toEqual({
      data: {
        post: {
          id: 1,
          title: "Hello",
        },
      },
    })

    await server.stop()
  }, 10000)

  test("enable graphiql", async () => {
    // todo: figure out why this test fails sometimes
    const port = await obtainPort()
    const server = await createApplicationServer(App, {
      appPath: __dirname + "/app",
      webserver: {
        port,
      },
      graphql: {
        graphiql: true,
      },
      resolvers: [PostResolver],
    }).start()

    // await sleep(2000)
    const response = await fetch(`http://localhost:${port}/graphql`, {
      headers: {
        Accept: "text/html",
      },
    })

    // if graphiql is enabled, regular GET query to the endpoint will be successful
    expect(response.status).toEqual(200)

    await server.stop()
  }, 20000)

  test("disable graphiql", async () => {
    const port = await obtainPort()
    const server = await createApplicationServer(App, {
      appPath: __dirname + "/app",
      webserver: {
        port,
      },
      graphql: {
        graphiql: false,
      },
      resolvers: [PostResolver],
    }).start()

    const response = await fetch(`http://localhost:${port}/graphql`, {
      headers: {
        Accept: "text/html",
      },
    })

    // if graphiql is enabled, regular GET query to the endpoint will be successful
    expect(response.status).toEqual(400)

    await server.stop()
  })

  test("graphiql is disabled by default", async () => {
    const port = await obtainPort()
    const server = await createApplicationServer(App, {
      appPath: __dirname + "/app",
      webserver: {
        port,
      },
      graphql: {
        graphiql: false,
      },
      resolvers: [PostResolver],
    }).start()

    const response = await fetch(`http://localhost:${port}/graphql`, {
      headers: {
        Accept: "text/html",
      },
    })

    // if graphiql is disabled, regular GET query to the endpoint will fail
    expect(response.status).toEqual(400)

    await server.stop()
  })

  test("enable playground", async () => {
    const port = await obtainPort()
    const server = await createApplicationServer(App, {
      appPath: __dirname + "/app",
      webserver: {
        port,
      },
      graphql: {
        playground: true,
      },
      resolvers: [PostResolver],
    }).start()

    const response = await fetch(`http://localhost:${port}/playground`, {
      headers: {
        Accept: "text/html",
      },
    })

    // if playground is enabled, regular GET query to the endpoint will be successful
    expect(response.status).toEqual(200)

    await server.stop()
  }, 20000)

  test("disable playground", async () => {
    const port = await obtainPort()
    const server = await createApplicationServer(App, {
      appPath: __dirname + "/app",
      webserver: {
        port,
      },
      graphql: {
        playground: false,
      },
      resolvers: [PostResolver],
    }).start()

    const response = await fetch(`http://localhost:${port}/playground`, {
      headers: {
        Accept: "text/html",
      },
    })

    // if playground is enabled, regular GET query to the endpoint will be successful
    expect(response.status).toEqual(404)

    await server.stop()
  })

  test("playground is disabled by default", async () => {
    const port = await obtainPort()
    const server = await createApplicationServer(App, {
      appPath: __dirname + "/app",
      webserver: {
        port,
      },
      graphql: {
        playground: false,
      },
      resolvers: [PostResolver],
    }).start()

    // await sleep(2000)
    const response = await fetch(`http://localhost:${port}/playground`, {
      headers: {
        Accept: "text/html",
      },
    })

    // if playground is disabled, regular GET query to the endpoint will fail
    expect(response.status).toEqual(404)

    await server.stop()
  })

  test("use extra graphql options", async () => {
    const port = await obtainPort()
    const server = await createApplicationServer(App, {
      appPath: __dirname + "/app",
      webserver: {
        port,
      },
      graphql: {
        options: {
          graphiql: true, // let's try to enable graphiql via options!
        },
      },
      resolvers: [PostResolver],
    }).start()

    const response = await fetch(`http://localhost:${port}/graphql`, {
      headers: {
        Accept: "text/html",
      },
    })

    // if graphiql is enabled, regular GET query to the endpoint will be successful
    expect(response.status).toEqual(200)

    await server.stop()
  }, 20000)
})
