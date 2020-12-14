import { ApplicationServer } from "@microframework/node"
import gql from "graphql-tag"
import { obtainPort, sleep } from "../../util/test-common"
import { createFetcher, Fetcher } from "@microframework/fetcher"
import { AppServer } from "./server"

// NOTE: if these tests are failing for you, make sure you have redis running

describe("node > rate limitation", () => {
  let port: number = 0
  let server: ApplicationServer<any> | undefined = undefined
  let fetcher: Fetcher<any> | undefined = undefined

  beforeEach(async () => {
    port = await obtainPort()
    fetcher = createFetcher({
      graphqlEndpoint: `http://localhost:${port}/graphql`,
    })
  })

  afterEach(async () => {
    if (server) {
      await server.stop()
    }
  })

  test("query limiting should work", async () => {
    server = await AppServer(port, {
      mutations: {
        postSave: {
          points: 10, // Number of points
          duration: 1, // Per second
        },
      },
    }).start()

    const query = gql`
      mutation {
        postSave(id: 1)
      }
    `
    await sleep(1000)
    for await (let item of new Array(10)) {
      const result = await fetcher!.fetch(query)
      expect(result).toEqual({
        data: {
          postSave: true,
        },
      })
    }

    let error: any
    try {
      await sleep(1000)
      for await (let item of new Array(11)) {
        await fetcher!.fetch(query)
      }
    } catch (err) {
      error = err
    }
    expect(error).toBeTruthy()
  })

  test("model property limiting should work", async () => {
    server = await AppServer(port, {
      queries: {
        post: {
          points: 10, // Number of points
          duration: 1, // Per second
        },
      },
    }).start()

    const query = gql`
      query {
        post(id: 1) {
          id
          title
          status
        }
      }
    `
    await sleep(1000)
    for await (let item of new Array(10)) {
      const result = await fetcher!.fetch(query)
      expect(result).toEqual({
        data: {
          post: {
            id: 1,
            title: "Hello",
            status: "draft",
          },
        },
      })
    }

    let error: any
    try {
      await sleep(1000)
      for await (let item of new Array(11)) {
        await fetcher!.fetch(query)
      }
    } catch (err) {
      error = err
    }
    expect(error).toBeTruthy()
  })

  test("action limiting should work", async () => {
    server = await AppServer(port, {
      actions: {
        "get /posts": {
          points: 10, // Number of points
          duration: 1, // Per second
        },
      },
    }).start()

    await sleep(1000)
    for await (let item of new Array(10)) {
      const response = await fetch(`http://localhost:${port}/posts`)
      const result = await response.json()
      expect(result).toEqual([
        {
          id: 1,
          title: "Hello",
          status: "draft",
        },
      ])
    }

    let error: any
    try {
      await sleep(1000)
      for await (let item of new Array(11)) {
        const response = await fetch(`http://localhost:${port}/posts`)
        if (response.status === 500) {
          error = await response.json()
        }
      }
    } catch (err) {
      error = err
    }
    expect(error).toBeTruthy()
  })
})
