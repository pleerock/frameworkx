import gql from 'graphql-tag'
import { TestFetcher } from "../../util/test-fetcher"
import { obtainPort, sleep } from "../../util/test-common"
import { AppServer } from "./server"

describe("node > features > error handling", () => {

    test("root resolver should properly throw error with code", async () => {
        const port = await obtainPort()
        const fetcher = new TestFetcher(`http://localhost:${port}/graphql`)
        const server = await AppServer(port).start()

        const result1 = await fetcher.graphql(gql`
            query {
                post(id: 1) {
                    id
                    title
                }
            }
        `)
        expect(result1).toEqual({
            "data": {
                "post": {
                    "id": 1,
                    "title": "Hello"
                },
            }
        })

        let error: any
        try {
            await fetcher.graphql(gql`
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

        await server.stop()
    })

    test("model resolver should properly throw error with code", async () => {
        const port = await obtainPort()
        const fetcher = new TestFetcher(`http://localhost:${port}/graphql`)
        const server = await AppServer(port).start()

        let error: any
        try {
            await fetcher.graphql(gql`
                query {
                    post(id: 3) {
                        id
                        title
                        status
                    }
                }
            `)

        } catch (err) {
            error = err
        }

        expect(error).toBeTruthy()
        expect(error.errors).toBeDefined()
        expect(error.errors.length).toEqual(1)
        expect(error.errors[0].message).toEqual("Status can't be set.")
        expect(error.errors[0].code).toEqual("CANT_SET_STATUS")

        await server.stop()
    })

    test("action resolver should properly throw error with code", async () => {
        const port = await obtainPort()
        const server = await AppServer(port).start()

        let error1: any
        try {
            const fetcher = new TestFetcher(`http://localhost:${port}/posts`)
            await fetcher.get()

        } catch (err) {
            error1 = err
        }

        expect(error1).toBeTruthy()
        expect(error1.message).toEqual("You have no access to this content.")

        let error2: any
        try {
            const fetcher = new TestFetcher(`http://localhost:${port}/posts-new`)
            await fetcher.get()

        } catch (err) {
            error2 = err
        }

        expect(error2).toBeTruthy()
        expect(error2.message).toEqual("You have no access to this content.")
        expect(error2.code).toEqual("NO_ACCESS")

        let error3: any
        try {
            const fetcher = new TestFetcher(`http://localhost:${port}/posts-old`)
            await fetcher.get()

        } catch (err) {
            error3 = err
        }

        expect(error3).toBeTruthy()
        expect(error3.message).toEqual("You have no access to this content.")

        // await server.stop()
    })

})
