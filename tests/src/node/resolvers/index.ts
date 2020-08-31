import { ApplicationServer } from "@microframework/node"
import gql from "graphql-tag"
import { obtainPort } from "../../util/test-common"
import { Fetcher } from "@microframework/fetcher"
import { PostClassActionResolver } from "./resolver/PostClassActionResolver"
import { PostContextResolver } from "./resolver/PostContextResolver"
import {
  PostItemFnDeclarationResolver,
  PostsItemFnDeclarationResolver,
} from "./resolver/PostDeclarationItemsResolver"
import { PostDeclarationWithContextResolver } from "./resolver/PostDeclarationWithContextResolver"
import { PostDLDecoratorModelResolver } from "./resolver/PostDLDecoratorModelResolver"
import { PostObjectActionDeclarationResolver } from "./resolver/PostObjectActionDeclarationResolver"
import { PostObjectDLModelResolver } from "./resolver/PostObjectDLModelResolver"
import { PostObjectFnDeclarationResolver } from "./resolver/PostObjectFnDeclarationResolver"
import { PostObjectModelResolver } from "./resolver/PostObjectModelResolver"
import { PostObjectRawDeclarationResolver } from "./resolver/PostObjectRawDeclarationResolver"
import { PostSimpleDecoratorDeclarationResolver } from "./resolver/PostSimpleDecoratorDeclarationResolver"
import { PostSimpleDecoratorModelResolver } from "./resolver/PostSimpleDecoratorModelResolver"
import { AppServer } from "./server"

const fetch = require("node-fetch")

describe("node > resolvers", () => {
  let port = 0
  let server: ApplicationServer<any> | undefined = undefined
  let fetcher: Fetcher | undefined = undefined

  beforeEach(async () => {
    port = await obtainPort()
    fetcher = new Fetcher({
      graphqlEndpoint: `http://localhost:${port}/graphql`,
    })
  })

  afterEach(async () => {
    if (server) {
      await server.stop()
    }
  })

  test("simple decorator resolvers for declarations and models", async () => {
    server = await AppServer(port, [
      PostSimpleDecoratorModelResolver,
      PostSimpleDecoratorDeclarationResolver,
    ]).start()

    const query = gql`
      query {
        posts {
          id
          title
          status
        }
      }
    `

    const result = await fetcher!.fetch(query)
    expect(result).toEqual({
      data: {
        posts: [
          {
            id: 1,
            title: "Post #1",
            status: "draft",
          },
          {
            id: 2,
            title: "Post #2",
            status: "draft",
          },
        ],
      },
    })
  })

  test("decorator resolvers for declarations and models with data loader applied", async () => {
    server = await AppServer(port, [
      PostDLDecoratorModelResolver,
      PostSimpleDecoratorDeclarationResolver,
    ]).start()

    const query = gql`
      query {
        posts {
          id
          title
          status
        }
      }
    `

    const result = await fetcher!.fetch(query)
    expect(result).toEqual({
      data: {
        posts: [
          {
            id: 1,
            title: "Post #1",
            status: "draft",
          },
          {
            id: 2,
            title: "Post #2",
            status: "draft",
          },
        ],
      },
    })
  })

  test("function resolvers for query and mutation declaration items", async () => {
    server = await AppServer(port, [
      PostItemFnDeclarationResolver,
      PostsItemFnDeclarationResolver,
    ]).start()

    const result1 = await fetcher!.fetch(gql`
      query {
        posts {
          id
          title
        }
      }
    `)
    expect(result1).toEqual({
      data: {
        posts: [
          {
            id: 1,
            title: "Post #1",
          },
          {
            id: 2,
            title: "Post #2",
          },
        ],
      },
    })

    const result2 = await fetcher!.fetch(gql`
      query {
        post(id: 777) {
          id
          title
        }
      }
    `)
    expect(result2).toEqual({
      data: {
        post: {
          id: 777,
          title: "Post #777",
        },
      },
    })
  })

  test("object resolver using resolver function for declarations", async () => {
    server = await AppServer(port, [PostObjectFnDeclarationResolver]).start()

    const result1 = await fetcher!.fetch(gql`
      query {
        posts {
          id
          title
        }
      }
    `)
    expect(result1).toEqual({
      data: {
        posts: [
          {
            id: 1,
            title: "Post #1",
          },
          {
            id: 2,
            title: "Post #2",
          },
        ],
      },
    })

    const result2 = await fetcher!.fetch(gql`
      query {
        post(id: 777) {
          id
          title
        }
      }
    `)
    expect(result2).toEqual({
      data: {
        post: {
          id: 777,
          title: "Post #777",
        },
      },
    })
  })

  test("object resolver without function for declarations", async () => {
    server = await AppServer(port, [
      PostObjectModelResolver,
      PostObjectRawDeclarationResolver,
    ]).start()

    const result1 = await fetcher!.fetch(gql`
      query {
        posts {
          id
          title
          status
        }
      }
    `)
    expect(result1).toEqual({
      data: {
        posts: [
          {
            id: 1,
            title: "Post #1",
            status: "draft",
          },
          {
            id: 2,
            title: "Post #2",
            status: "draft",
          },
        ],
      },
    })

    const result2 = await fetcher!.fetch(gql`
      query {
        post(id: 777) {
          id
          title
          status
        }
      }
    `)
    expect(result2).toEqual({
      data: {
        post: {
          id: 777,
          title: "Post #777",
          status: "draft",
        },
      },
    })
  })

  test("object resolver for model with data loader", async () => {
    server = await AppServer(port, [
      PostObjectDLModelResolver,
      PostObjectRawDeclarationResolver,
    ]).start()

    const result1 = await fetcher!.fetch(gql`
      query {
        posts {
          id
          title
          status
        }
      }
    `)
    expect(result1).toEqual({
      data: {
        posts: [
          {
            id: 1,
            title: "Post #1",
            status: "draft",
          },
          {
            id: 2,
            title: "Post #2",
            status: "draft",
          },
        ],
      },
    })

    const result2 = await fetcher!.fetch(gql`
      query {
        post(id: 777) {
          id
          title
          status
        }
      }
    `)
    expect(result2).toEqual({
      data: {
        post: {
          id: 777,
          title: "Post #777",
          status: "draft",
        },
      },
    })
  }, 10000)

  test("class action resolver", async () => {
    server = await AppServer(port, [PostClassActionResolver]).start()

    const response1 = await fetch(`http://localhost:${port}/posts`, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    const result1 = await response1.json()

    expect(result1).toEqual([
      {
        id: 1,
        title: "Post #1",
        status: "draft",
      },
      {
        id: 2,
        title: "Post #2",
        status: "draft",
      },
    ])

    const response2 = await fetch(`http://localhost:${port}/post/777`, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    const result2 = await response2.json()
    expect(result2).toEqual({
      id: "777",
      title: "Post #777",
      status: "draft",
    })
  })

  test("object action resolver", async () => {
    server = await AppServer(port, [
      PostObjectActionDeclarationResolver,
    ]).start()

    const response1 = await fetch(`http://localhost:${port}/posts`, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    const result1 = await response1.json()

    expect(result1).toEqual([
      {
        id: 1,
        title: "Post #1",
        status: "draft",
      },
      {
        id: 2,
        title: "Post #2",
        status: "draft",
      },
    ])

    const response2 = await fetch(`http://localhost:${port}/post/777`, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    const result2 = await response2.json()
    expect(result2).toEqual({
      id: "777", // todo: this should be a number!
      title: "Post #777",
      status: "draft",
    })
  })

  test("context resolver", async () => {
    server = await AppServer(port, [
      PostDeclarationWithContextResolver,
      PostContextResolver,
    ]).start()

    const result2 = await fetcher!.fetch(gql`
      query {
        postFromSession {
          id
          title
          status
        }
      }
    `)
    expect(result2).toEqual({
      data: {
        postFromSession: {
          id: 0,
          title: "I am Session Post resolved by a context",
          status: "published" as const,
        },
      },
    })
  })
})
