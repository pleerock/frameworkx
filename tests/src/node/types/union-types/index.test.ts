import { ApplicationServer } from "@microframework/node"
import gql from "graphql-tag"
import { obtainPort } from "../../../util/test-common"
import { createFetcher, Fetcher } from "@microframework/fetcher"
import { AppServer } from "./server"

describe("node > types > union types", () => {
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

  test("union type in returned value", async () => {
    const result1 = await fetcher!.fetch(gql`
      query {
        post(id: 1) {
          id
          title
          author {
            ... on UserType {
              id
              firstName
              lastName
            }
            ... on OrganizationType {
              id
              name
            }
          }
        }
      }
    `)
    expect(result1).toEqual({
      data: {
        post: {
          id: 1,
          title: "User's post",
          author: {
            id: "1",
            firstName: "Timber",
            lastName: "Saw",
          },
        },
      },
    })

    const result2 = await fetcher!.fetch(gql`
      query {
        post(id: 2) {
          id
          title
          author {
            ... on UserType {
              id
              firstName
              lastName
            }
            ... on OrganizationType {
              id
              name
            }
          }
        }
      }
    `)
    expect(result2).toEqual({
      data: {
        post: {
          id: 2,
          title: "Organization's post",
          author: {
            id: "1",
            name: "AwesomeCorp",
          },
        },
      },
    })
  })
})
