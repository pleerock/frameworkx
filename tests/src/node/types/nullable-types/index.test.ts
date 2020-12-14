import { ApplicationServer } from "@microframework/node"
import gql from "graphql-tag"
import { obtainPort } from "../../../util/test-common"
import { createFetcher, Fetcher } from "@microframework/fetcher"
import { AppServer } from "./server"

describe("node > types > nullable types", () => {
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

  test("different null and undefined values in returned value", async () => {
    const result1 = await fetcher!.fetch(gql`
      query {
        post(id: 1) {
          id
          questionMarked
          undefinedMarked
          nullableMarked
          undefinedAndNullableMarked
          everythingMarked
          arrayQuestionMarked
          arrayUndefinedMarked
          arrayNullableMarked
          arrayUndefinedAndNullableMarked
          arrayEverythingMarked
          floatQuestionMarked
          floatUndefinedMarked
          floatNullableMarked
          floatUndefinedAndNullableMarked
          floatEverythingMarked
          floatArrayAndMarked
        }
      }
    `)
    expect(result1).toEqual({
      data: {
        post: {
          id: 1,
          questionMarked: "some value",
          undefinedMarked: null,
          nullableMarked: null,
          undefinedAndNullableMarked: null,
          everythingMarked: null,
          arrayQuestionMarked: null,
          arrayUndefinedMarked: ["some value"],
          arrayNullableMarked: null,
          arrayUndefinedAndNullableMarked: [],
          arrayEverythingMarked: null,
          floatQuestionMarked: null,
          floatUndefinedMarked: null,
          floatNullableMarked: 1.1,
          floatUndefinedAndNullableMarked: null,
          floatEverythingMarked: 2.2,
          floatArrayAndMarked: [1.1, 2.2],
        },
      },
    })
  })

  test("different null and undefined values in input", async () => {
    const result1 = await fetcher!.fetch(gql`
      mutation {
        postCreate(
          questionMarked: "some value"
          undefinedMarked: null
          nullableMarked: null
          undefinedAndNullableMarked: null
          everythingMarked: null
          arrayQuestionMarked: null
          arrayUndefinedMarked: ["some value"]
          arrayNullableMarked: null
          arrayUndefinedAndNullableMarked: []
          arrayEverythingMarked: null
          floatQuestionMarked: null
          floatUndefinedMarked: null
          floatNullableMarked: 1.1
          floatUndefinedAndNullableMarked: null
          floatEverythingMarked: 2.2
          floatArrayAndMarked: [1.1, 2.2]
        ) {
          id
          questionMarked
          undefinedMarked
          nullableMarked
          undefinedAndNullableMarked
          everythingMarked
          arrayQuestionMarked
          arrayUndefinedMarked
          arrayNullableMarked
          arrayUndefinedAndNullableMarked
          arrayEverythingMarked
          floatQuestionMarked
          floatUndefinedMarked
          floatNullableMarked
          floatUndefinedAndNullableMarked
          floatEverythingMarked
          floatArrayAndMarked
        }
      }
    `)
    expect(result1).toEqual({
      data: {
        postCreate: {
          id: 1,
          questionMarked: "some value",
          undefinedMarked: null,
          nullableMarked: null,
          undefinedAndNullableMarked: null,
          everythingMarked: null,
          arrayQuestionMarked: null,
          arrayUndefinedMarked: ["some value"],
          arrayNullableMarked: null,
          arrayUndefinedAndNullableMarked: [],
          arrayEverythingMarked: null,
          floatQuestionMarked: null,
          floatUndefinedMarked: null,
          floatNullableMarked: 1.1,
          floatUndefinedAndNullableMarked: null,
          floatEverythingMarked: 2.2,
          floatArrayAndMarked: [1.1, 2.2],
        },
      },
    })
  })
})
