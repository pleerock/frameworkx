import { ApplicationServer } from "@microframework/node"
import gql from "graphql-tag"
import { obtainPort } from "../../../util/test-common"
import { TestFetcher } from "../../../util/test-fetcher"
import { StatusType } from "./models"
import { AppServer } from "./server"

describe("node > types > enum type", () => {
  let server: ApplicationServer<any> | undefined = undefined
  let fetcher: TestFetcher | undefined = undefined

  beforeEach(async () => {
    const port = await obtainPort()
    fetcher = new TestFetcher(`http://localhost:${port}/graphql`)
    server = await AppServer(port).start()
  })

  afterEach(async () => {
    if (server) {
      await server.stop()
    }
  })

  test("enum type in returned value", async () => {
    const result1 = await fetcher!.graphql(gql`
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
          status: StatusType.PUBLISHED,
        },
      },
    })

    const result2 = await fetcher!.graphql(gql`
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
          status: StatusType.DRAFT,
        },
      },
    })
  })

  test("enum type in input", async () => {
    const result1 = await fetcher!.graphql(gql`
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
          status: StatusType.ON_MODERATION,
        },
      },
    })
  })
})
