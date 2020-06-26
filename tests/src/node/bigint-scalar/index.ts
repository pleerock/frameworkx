import { obtainPort } from "../../util/test-common"
import { TestFetcher } from "../../util/test-fetcher"
import { AppServer } from "./server"

describe("node > features > date scalar type", () => {
  test("", async () => {
    const port = await obtainPort()
    const fetcher = new TestFetcher(`http://localhost:${port}/graphql`)
    const server = await AppServer(port).start()

    console.log(`http://localhost:${port}/graphql`)

    // const result1 = await fetcher.graphql(gql`
    //   query {
    //     post(id: 1) {
    //       id
    //       title
    //     }
    //   }
    // `)
    // expect(result1).toEqual({
    //   data: {
    //     post: {
    //       id: 1,
    //       title: "Hello",
    //     },
    //   },
    // })
    //
    // let error: any
    // try {
    //   await fetcher.graphql(gql`
    //     query {
    //       post(id: -1) {
    //         id
    //         title
    //       }
    //     }
    //   `)
    // } catch (err) {
    //   error = err
    // }
    //
    // expect(error).toBeTruthy()
    // expect(error.errors).toBeDefined()
    // expect(error.errors.length).toEqual(1)
    // expect(error.errors[0].message).toEqual("Post id isn't valid.")
    // expect(error.errors[0].code).toEqual("900009")

    // await server.stop()
  })
})
