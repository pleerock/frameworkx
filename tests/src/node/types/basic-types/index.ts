import { ApplicationServer } from "@microframework/node"
import gql from "graphql-tag"
import { obtainPort } from "../../../util/test-common"
import { Fetcher } from "@microframework/fetcher"
import { AppServer } from "./server"

describe("node > types > basic types", () => {
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

  test("basic types in returned value", async () => {
    const result1 = await fetcher!.fetch(gql`
      query {
        post(id: 1) {
          id
          views
          title
          published
          coefficient
          tags
          counters
          coefficients
        }
      }
    `)
    expect(result1).toEqual({
      data: {
        post: {
          id: 1,
          views: 0,
          title: "About ORM",
          published: false,
          coefficient: 1.5,
          tags: ["orm", "database", "rdbms"],
          counters: [1, 2, 3],
          coefficients: [1.1, 2.2, 3.3],
        },
      },
    })
  })

  test("basic types in input value", async () => {
    const result1 = await fetcher!.fetch(gql`
      mutation {
        postCreate(
          title: "Backbone"
          views: 1
          published: true
          coefficient: 0.1
          tags: ["backbone", "say-no", "to", "hernia"]
          counters: [1, 1, 2, 2]
          coefficients: [1.1, 1.2, 1.3, 1.4, 1.5]
        ) {
          id
          views
          title
          published
          coefficient
          tags
          counters
          coefficients
        }
      }
    `)
    expect(result1).toEqual({
      data: {
        postCreate: {
          id: 1,
          title: "Backbone",
          views: 1,
          published: true,
          coefficient: 0.1,
          tags: ["backbone", "say-no", "to", "hernia"],
          counters: [1, 1, 2, 2],
          coefficients: [1.1, 1.2, 1.3, 1.4, 1.5],
        },
      },
    })
  })
})
