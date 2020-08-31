import { ApplicationServer } from "@microframework/node"
import { Fetcher } from "@microframework/fetcher"
import gql from "graphql-tag"
import { obtainPort } from "../../../util/test-common"
import { AppServer } from "./server"

describe("node > types > bigint", () => {
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

  test("bigint in returned values", async () => {
    const result1 = await fetcher!.fetch(gql`
      query {
        post(id: 1) {
          id
          title
          views
          likes
        }
      }
    `)
    expect(result1).toEqual({
      data: {
        post: {
          id: 1,
          title: "Hello",
          views: "9007199254740991",
          likes: "1234567890",
        },
      },
    })
  })

  test("bigint in inputs", async () => {
    const result1 = await fetcher!.fetch(gql`
      mutation {
        postCreate(title: "Hello World", views: "1007199254740991") {
          id
          title
          views
          likes
        }
      }
    `)
    expect(result1).toEqual({
      data: {
        postCreate: {
          id: 1,
          title: "Hello World",
          views: String(BigInt("1007199254740991") * BigInt("2")),
          likes: "1234567890",
        },
      },
    })
  })
})
