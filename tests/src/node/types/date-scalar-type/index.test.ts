import { ApplicationServer } from "@microframework/node"
import gql from "graphql-tag"
import { obtainPort } from "../../../util/test-common"
import { Fetcher } from "@microframework/fetcher"
import { AppServer } from "./server"

describe("node > types > dates", () => {
  const date = new Date(2020, 6, 1, 6, 0, 0, 0)
  let server: ApplicationServer<any> | undefined = undefined
  let fetcher: Fetcher | undefined = undefined

  beforeEach(async () => {
    const port = await obtainPort()
    fetcher = new Fetcher({
      graphqlEndpoint: `http://localhost:${port}/graphql`,
    })
    server = await AppServer(port).start()
  })

  afterEach(async () => {
    if (server) {
      await server.stop()
    }
  })

  test("date types in returned values", async () => {
    const result1 = await fetcher!.fetch(gql`
      query {
        post(id: 1) {
          id
          title
          lastDate
          lastTime
          createdAt
        }
      }
    `)
    expect(result1).toEqual({
      data: {
        post: {
          id: 1,
          title: "Hello",
          lastDate: "2020-07-01",
          lastTime: date.toISOString().replace("2020-07-01T", ""),
          createdAt: date.toISOString(),
        },
      },
    })
  })

  test("date types in inputs", async () => {
    const result1 = await fetcher!.fetch(gql`
      mutation {
        postCreate(
          title: "Hello World"
          lastDate: "2020-07-01"
          lastTime: "03:00:00.000Z"
          createdAt: "2020-07-01T03:00:00.000Z"
        ) {
          id
          title
          lastDate
          lastTime
          createdAt
        }
      }
    `)
    expect(result1).toEqual({
      data: {
        postCreate: {
          id: 1,
          title: "Hello World",
          lastDate: "2020-07-01",
          lastTime: "03:00:00.000Z",
          createdAt: "2020-07-01T03:00:00.000Z",
        },
      },
    })
  })
})
