import gql from 'graphql-tag';
import { GraphqlFetcher } from "../../util/graphql-fetcher";
import { obtainPort } from "../../util/port-generator";
import { App } from "./app";
import { PostClassActionResolver } from "./resolver/PostClassActionResolver";
import {
    PostItemFnDeclarationResolver,
    PostsItemFnDeclarationResolver
} from "./resolver/PostDeclarationItemsResolver";
import { PostDLDecoratorModelResolver } from "./resolver/PostDLDecoratorModelResolver";
import { PostObjectActionDeclarationResolver } from "./resolver/PostObjectActionDeclarationResolver";
import { PostObjectDLModelResolver } from "./resolver/PostObjectDLModelResolver";
import { PostObjectFnDeclarationResolver } from "./resolver/PostObjectFnDeclarationResolver";
import { PostObjectModelResolver } from "./resolver/PostObjectModelResolver";
import { PostObjectRawDeclarationResolver } from "./resolver/PostObjectRawDeclarationResolver";
import { PostSimpleDecoratorDeclarationResolver } from "./resolver/PostSimpleDecoratorDeclarationResolver";
import { PostSimpleDecoratorModelResolver } from "./resolver/PostSimpleDecoratorModelResolver";
import { AppServer } from "./server";

const fetch = require('node-fetch');

describe("apps > resolvers", () => {
    const fetcher = new GraphqlFetcher("http://localhost:3000/graphql")

    test("simple decorator resolvers for declarations and models", async () => {
        const port = await obtainPort()
        const fetcher = new GraphqlFetcher(`http://localhost:${port}/graphql`)

        await App.setResolvers([
            PostSimpleDecoratorModelResolver,
            PostSimpleDecoratorDeclarationResolver,
        ]).bootstrap(AppServer(port))

        const query = gql`
            query {
                posts {
                    id
                    title
                    status
                }
            }
        `

        const result = await fetcher.fetch(query)
        expect(result).toEqual({
            "data": {
                "posts": [
                    {
                        "id": 1,
                        "title": "Post #1",
                        "status": "draft"
                    },
                    {
                        "id": 2,
                        "title": "Post #2",
                        "status": "draft"
                    }
                ]
            }
        })

        await App.stop()
    })

    test("decorator resolvers for declarations and models with data loader applied", async () => {
        const port = await obtainPort()
        const fetcher = new GraphqlFetcher(`http://localhost:${port}/graphql`)

        await App.setResolvers([
            PostDLDecoratorModelResolver,
            PostSimpleDecoratorDeclarationResolver,
        ]).bootstrap(AppServer(port))

        const query = gql`
            query {
                posts {
                    id
                    title
                    status
                }
            }
        `

        const result = await fetcher.fetch(query)
        expect(result).toEqual({
            "data": {
                "posts": [
                    {
                        "id": 1,
                        "title": "Post #1",
                        "status": "draft"
                    },
                    {
                        "id": 2,
                        "title": "Post #2",
                        "status": "draft"
                    }
                ]
            }
        })

        await App.stop()
    })

    test("function resolvers for query and mutation declaration items", async () => {
        const port = await obtainPort()
        const fetcher = new GraphqlFetcher(`http://localhost:${port}/graphql`)

        await App.setResolvers([
            PostItemFnDeclarationResolver,
            PostsItemFnDeclarationResolver,
        ]).bootstrap(AppServer(port))

        const result1 = await fetcher.fetch(gql`
            query {
                posts {
                    id
                    title
                }
            }
        `)
        expect(result1).toEqual({
            "data": {
                "posts": [
                    {
                        "id": 1,
                        "title": "Post #1",
                    },
                    {
                        "id": 2,
                        "title": "Post #2",
                    }
                ]
            }
        })

        const result2 = await fetcher.fetch(gql`
            query {
                post(id: 777) {
                    id
                    title
                }
            }
        `)
        expect(result2).toEqual({
            "data": {
                "post": {
                    "id": 777,
                    "title": "Post #777",
                }
            }
        })

        await App.stop()
    })

    test("object resolver using resolver function for declarations", async () => {
        const port = await obtainPort()
        const fetcher = new GraphqlFetcher(`http://localhost:${port}/graphql`)

        await App.setResolvers([
            PostObjectFnDeclarationResolver,
        ]).bootstrap(AppServer(port))

        const result1 = await fetcher.fetch(gql`
            query {
                posts {
                    id
                    title
                }
            }
        `)
        expect(result1).toEqual({
            "data": {
                "posts": [
                    {
                        "id": 1,
                        "title": "Post #1",
                    },
                    {
                        "id": 2,
                        "title": "Post #2",
                    }
                ]
            }
        })

        const result2 = await fetcher.fetch(gql`
            query {
                post(id: 777) {
                    id
                    title
                }
            }
        `)
        expect(result2).toEqual({
            "data": {
                "post": {
                    "id": 777,
                    "title": "Post #777",
                }
            }
        })

        await App.stop()
    })

    test("object resolver without function for declarations", async () => {
        const port = await obtainPort()
        const fetcher = new GraphqlFetcher(`http://localhost:${port}/graphql`)

        await App.setResolvers([
            PostObjectModelResolver,
            PostObjectRawDeclarationResolver,
        ]).bootstrap(AppServer(port))

        const result1 = await fetcher.fetch(gql`
            query {
                posts {
                    id
                    title
                    status
                }
            }
        `)
        expect(result1).toEqual({
            "data": {
                "posts": [
                    {
                        "id": 1,
                        "title": "Post #1",
                        "status": "draft",
                    },
                    {
                        "id": 2,
                        "title": "Post #2",
                        "status": "draft",
                    }
                ]
            }
        })

        const result2 = await fetcher.fetch(gql`
            query {
                post(id: 777) {
                    id
                    title
                    status
                }
            }
        `)
        expect(result2).toEqual({
            "data": {
                "post": {
                    "id": 777,
                    "title": "Post #777",
                    "status": "draft",
                }
            }
        })

        await App.stop()
    })

    test("object resolver for model with data loader", async () => {
        const port = await obtainPort()
        const fetcher = new GraphqlFetcher(`http://localhost:${port}/graphql`)

        await App.setResolvers([
            PostObjectDLModelResolver,
            PostObjectRawDeclarationResolver,
        ]).bootstrap(AppServer(port))

        const result1 = await fetcher.fetch(gql`
            query {
                posts {
                    id
                    title
                    status
                }
            }
        `)
        expect(result1).toEqual({
            "data": {
                "posts": [
                    {
                        "id": 1,
                        "title": "Post #1",
                        "status": "draft",
                    },
                    {
                        "id": 2,
                        "title": "Post #2",
                        "status": "draft",
                    }
                ]
            }
        })

        const result2 = await fetcher.fetch(gql`
            query {
                post(id: 777) {
                    id
                    title
                    status
                }
            }
        `)
        expect(result2).toEqual({
            "data": {
                "post": {
                    "id": 777,
                    "title": "Post #777",
                    "status": "draft",
                }
            }
        })

        await App.stop()
    })

    test("class action resolver", async () => {
        const port = await obtainPort()

        await App.setResolvers([
            PostClassActionResolver,
        ]).bootstrap(AppServer(port))

        const response1 = await fetch(`http://localhost:${port}/posts`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        })
        const result1 = await response1.json()

        expect(result1).toEqual([
            {
                "id": 1,
                "title": "Post #1",
                "status": "draft",
            },
            {
                "id": 2,
                "title": "Post #2",
                "status": "draft",
            }
        ])

        const response2 = await fetch(`http://localhost:${port}/post/777`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        })
        const result2 = await response2.json()
        expect(result2).toEqual({
            "id": "777",
            "title": "Post #777",
            "status": "draft",
        })

        await App.stop()
    })

    test("object action resolver", async () => {
        const port = await obtainPort()

        await App.setResolvers([
            PostObjectActionDeclarationResolver,
        ]).bootstrap(AppServer(port))

        const response1 = await fetch(`http://localhost:${port}/posts`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        })
        const result1 = await response1.json()

        expect(result1).toEqual([
            {
                "id": 1,
                "title": "Post #1",
                "status": "draft",
            },
            {
                "id": 2,
                "title": "Post #2",
                "status": "draft",
            }
        ])

        const response2 = await fetch(`http://localhost:${port}/post/777`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        })
        const result2 = await response2.json()
        expect(result2).toEqual({
            "id": "777",
            "title": "Post #777",
            "status": "draft",
        })

        await App.stop()
    })

})
