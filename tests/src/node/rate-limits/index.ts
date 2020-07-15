import { ApplicationServer } from "@microframework/node"
import gql from "graphql-tag"
import { obtainPort, sleep } from "../../util/test-common"
import { TestFetcher } from "../../util/test-fetcher"
import { AppServer } from "./server"

// NOTE: if these tests are failing for you, make sure you have redis running

describe("node > rate limitation", () => {
  let port: number = 0
  let server: ApplicationServer<any> | undefined = undefined
  let fetcher: TestFetcher | undefined = undefined

  beforeEach(async () => {
    port = await obtainPort()
    fetcher = new TestFetcher(`http://localhost:${port}/graphql`)
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
      const result = await fetcher!.graphql(query)
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
        await fetcher!.graphql(query)
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
      const result = await fetcher!.graphql(query)
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
        await fetcher!.graphql(query)
      }
    } catch (err) {
      error = err
    }
    expect(error).toBeTruthy()
  })

  test("action limiting should work", async () => {
    fetcher = new TestFetcher(`http://localhost:${port}/posts`)
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
      const result = await fetcher.get()
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
        await fetcher.get()
      }
    } catch (err) {
      error = err
    }
    expect(error).toBeTruthy()
  })
})
