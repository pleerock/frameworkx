import { ApplicationServer } from "@microframework/node"
import gql from "graphql-tag"
import { obtainPort } from "../../../util/test-common"
import { createFetcher, Fetcher, FetcherError } from "@microframework/fetcher"
import { AppServer } from "./server"
import { FetchError } from "node-fetch"

describe("node > error handling > basic errors", () => {
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

  test("throw error in root resolver", async () => {
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

    let error: any
    try {
      await fetcher!.fetch(gql`
        query {
          post(id: -1) {
            id
            title
          }
        }
      `)
    } catch (err) {
      error = err
    }

    expect(error).toBeTruthy()
    expect(error.errors).toBeDefined()
    expect(error.errors.length).toEqual(1)
    expect(error.errors[0].message).toEqual("Post id isn't valid.")
    expect(error.errors[0].code).toEqual("900009")
  })

  test("throw error in model resolver", async () => {
    let error: FetcherError | undefined = undefined
    try {
      await fetcher!.fetch(gql`
        query {
          post(id: 3) {
            id
            title
            status
          }
        }
      `)
    } catch (err: any) {
      error = err
    }

    expect(error).toBeInstanceOf(FetcherError)
    expect(error!.errors).toBeDefined()
    expect(error!.errors.length).toEqual(1)
    expect(error!.errors[0].message).toEqual("Status can't be set.")
    expect(error!.errors[0].code).toEqual("CANT_SET_STATUS")
  })

  test("throw error in action resolver", async () => {
    const response1 = await fetch(`http://localhost:${port}/posts`)
    const error1 = await response1.json()

    expect(response1.status).toEqual(500)
    expect(error1.message).toEqual("You have no access to this content.")

    const response2 = await fetch(`http://localhost:${port}/posts-new`)
    const error2 = await response2.json()

    expect(response2.status).toEqual(500)
    expect(error2.message).toEqual("You have no access to this content.")
    expect(error2.code).toEqual("NO_ACCESS")

    const response3 = await fetch(`http://localhost:${port}/posts-old`)
    const error3 = await response3.json()
    expect(error3).toBeTruthy()
    expect(error3.message).toEqual("You have no access to this content.")
  })
})
