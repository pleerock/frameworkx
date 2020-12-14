import { ApplicationServer } from "@microframework/node"
import gql from "graphql-tag"
import { obtainPort } from "../../../util/test-common"
import { createFetcher, Fetcher } from "@microframework/fetcher"
import { AppServer } from "./server"

describe("node > error handling > custom handler", () => {
  let port: number = 0
  let server: ApplicationServer<any> | undefined = undefined
  let fetcher: Fetcher<any> | undefined = undefined

  beforeEach(async () => {
    port = await obtainPort()
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

  test("resolver custom error handling", async () => {
    const result1 = await fetcher!.fetch(gql`
      query {
        post(id: 1) {
          id
          title
        }
      }
    `)
    expect(result1).toEqual({
      data: {
        post: {
          id: 1,
          title: "Hello",
        },
      },
    })

    const response = await fetcher!.response(gql`
      query {
        post(id: -1) {
          id
          title
        }
      }
    `)
    const error = await response.json()

    expect(response.status).toEqual(400)
    expect(error).toBeTruthy()
    expect(error.errors).toBeDefined()
    expect(error.errors.length).toEqual(1)
    expect(error.errors[0].message).toEqual("Error =(")
  })

  test("actions custom error handling", async () => {
    const response = await fetch(`http://localhost:${port}/posts`)
    const error = await response.json()

    expect(response.status).toEqual(400)
    expect(error).toBeTruthy()
    expect(error.message).toEqual("You have no access to this content.")
  })
})
