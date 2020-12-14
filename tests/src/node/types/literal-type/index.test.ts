import { ApplicationServer } from "@microframework/node"
import gql from "graphql-tag"
import { obtainPort } from "../../../util/test-common"
import { createFetcher, Fetcher } from "@microframework/fetcher"
import { AppServer } from "./server"

describe("node > types > literal type", () => {
  let server: ApplicationServer<any> | undefined = undefined
  let fetcher: Fetcher<any> | undefined = undefined

  beforeEach(async () => {
    const port = await obtainPort()
    fetcher = createFetcher({
      graphqlEndpoint: `http://localhost:${port}/graphql`,
    })
    server = await AppServer(port).start()
  })

  afterEach(async () => {
    if (server) {
      await server.stop()
    }
  })

  test("literal type in returned value", async () => {
    const result1 = await fetcher!.fetch(gql`
      query {
        post(id: 1) {
          id
          title
          status
        }
      }
    `)
    expect(result1).toEqual({
      data: {
        post: {
          id: 1,
          title: "Some title",
          status: "PUBLISHED",
        },
      },
    })

    const result2 = await fetcher!.fetch(gql`
      query {
        post(id: 2) {
          id
          title
          status
        }
      }
    `)
    expect(result2).toEqual({
      data: {
        post: {
          id: 2,
          title: "Some title",
          status: "DRAFT",
        },
      },
    })
  })

  test("literal type in input", async () => {
    const result1 = await fetcher!.fetch(gql`
      mutation {
        postCreate(title: "New post", status: ON_MODERATION) {
          id
          title
          status
        }
      }
    `)
    expect(result1).toEqual({
      data: {
        postCreate: {
          id: 1,
          title: "New post",
          status: "ON_MODERATION",
        },
      },
    })
  })
})
