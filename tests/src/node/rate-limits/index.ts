import gql from 'graphql-tag'
import { TestFetcher } from "../../util/test-fetcher"
import { obtainPort, sleep } from "../../util/test-common"
import { AppServer } from "./server"

describe("node > features > rate limitation", () => {

    test("query limiting should work", async () => {

        const port = await obtainPort()
        const fetcher = new TestFetcher(`http://localhost:${port}/graphql`)
        const server = await AppServer(port, {
            mutations: {
                postSave: {
                    points: 10, // Number of points
                    duration: 1, // Per second
                }
            }
        }).start()

        const query = gql`
            mutation {
                postSave(id: 1)
            }
        `

        await sleep(1000)
        for await (let item of new Array(10)) {
            const result = await fetcher.graphql(query)
            expect(result).toEqual({
                "data": {
                    "postSave": true
                }
            })
        }

        let error: any
        try {
            await sleep(1000)
            for await (let item of new Array(11)) {
                await fetcher.graphql(query)
            }

        } catch (err) { error = err }
        expect(error).toBeTruthy()

        await server.stop()
    })

    test("model property limiting should work", async () => {

        const port = await obtainPort()
        const fetcher = new TestFetcher(`http://localhost:${port}/graphql`)
        const server = await AppServer(port, {
            queries: {
                post: {
                    points: 10, // Number of points
                    duration: 1, // Per second
                }
            }
        }).start()

        const query = gql`
            query {
                post(id: 1) {
                    id
                    title
                    status
                }
            }
        `
        await sleep(1000)
        for await (let item of new Array(10)) {
            const result = await fetcher.graphql(query)
            expect(result).toEqual({
                "data": {
                    "post": {
                        "id": 1,
                        "title": "Hello",
                        "status": "draft"
                    },
                }
            })
        }

        let error: any
        try {
            await sleep(1000)
            for await (let item of new Array(11)) {
                await fetcher.graphql(query)
            }

        } catch (err) { error = err }
        expect(error).toBeTruthy()

        await server.stop()
    })

    test("action limiting should work", async () => {

        const port = await obtainPort()
        const fetcher = new TestFetcher(`http://localhost:${port}/posts`)
        const server = await AppServer(port, {
            actions: {
                "get /posts": {
                    points: 10, // Number of points
                    duration: 1, // Per second
                }
            }
        }).start()

        await sleep(1000)
        for await (let item of new Array(10)) {
            const result = await fetcher.get()
            expect(result).toEqual([{
                "id": 1,
                "title": "Hello",
                "status": "draft"
            }])
        }

        let error: any
        try {
            await sleep(1000)
            for await (let item of new Array(11)) {
                await fetcher.get()
            }

        } catch (err) { error = err }
        expect(error).toBeTruthy()

        await server.stop()
    })

})
