import { createFetcher, Fetcher } from "@microframework/fetcher"
import { ApplicationServer } from "@microframework/node"
import gql from "graphql-tag"
import ws from "ws"
import { obtainPort, sleep } from "../util/test-common"
import { App } from "./fetcher-test-app/app"
import { AppServer } from "./fetcher-test-app/server"
import { PostList } from "./fetcher-test-app/repositories"
import { PostType } from "./fetcher-test-app/models"
import { FetcherUtils } from "@microframework/fetcher/_/fetcher-utils"

describe("fetcher > requests > request fn", () => {
  let webserverPort: number = 0
  let websocketPort: number = 0
  let server: ApplicationServer<any> | undefined = undefined
  let fetcher: Fetcher<any> | undefined = undefined

  beforeEach(async () => {
    webserverPort = await obtainPort()
    websocketPort = await obtainPort()
    server = await AppServer(webserverPort, websocketPort).start()
    fetcher = createFetcher({
      clientId: "jest-test-fetcher",
      actionEndpoint: `http://localhost:${webserverPort}`,
      graphqlEndpoint: `http://localhost:${webserverPort}/graphql`,
      websocketEndpoint: `ws://localhost:${websocketPort}/subscriptions`,
      websocketOptions: {
        WebSocket: ws,
        connectionTimeout: 1000,
        maxRetries: 10,
      },
    })
  })

  afterEach(async () => {
    if (server) {
      await server.stop()
    }
  })

  test("fetch by request > case #1 (single item)", async () => {
    const postsRequest = App.requestFn("Posts", {
      firstPost: App.query("postRandomOne", {
        id: true,
        title: true,
      }),
    })

    const result = await fetcher!.fetch(postsRequest())
    expect(result).toEqual({
      data: {
        firstPost: {
          id: 1,
          title: "post #1",
        },
      },
    } as typeof result)

    // @ts-expect-error
    result.firstPost
    // @ts-expect-error
    result.data.secondPost
    // @ts-expect-error
    result.data.firstPost.likes
  })

  test("fetch by request > case #2 (loading array)", async () => {
    const postsRequest = App.requestFn("Posts", {
      posts: App.query("posts", {
        id: true,
        title: true,
      }),
    })

    const result = await fetcher!.fetch(
      postsRequest({
        posts: {
          skip: 0,
          take: 5,
          ids: [],
        },
      }),
    )
    expect(result).toEqual({
      data: {
        posts: [
          {
            id: 1,
            title: "post #1",
          },
          {
            id: 2,
            title: "post #2",
          },
          {
            id: 3,
            title: "post #3",
          },
        ],
      },
    })
  })

  test("fetch by request > case #3 (nested selection)", async () => {
    const postsRequest = App.requestFn("Posts", {
      posts: App.query("posts", {
        id: true,
        title: true,
        categories: {
          id: true,
        },
      }),
    })

    const result = await fetcher!.fetch(
      postsRequest({
        posts: {
          skip: 0,
          take: 5,
          ids: [],
        },
      }),
    )
    expect(result).toEqual({
      data: {
        posts: [
          {
            id: 1,
            title: "post #1",
            categories: [{ id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }],
          },
          {
            id: 2,
            title: "post #2",
            categories: [{ id: 3 }, { id: 4 }, { id: 5 }],
          },
          {
            id: 3,
            title: "post #3",
            categories: [{ id: 4 }, { id: 5 }],
          },
        ],
      },
    })
  })
  test("fetch by request > case #4 (input)", async () => {
    const postsRequest = App.requestFn("Posts", {
      posts: App.query("posts", {
        id: true,
        title: true,
        categories: {
          id: true,
        },
      }),
    })

    const result = await fetcher!.fetch(
      postsRequest({
        posts: {
          skip: 0,
          take: 5,
          active: true,
          ids: [],
        },
      }),
    )
    expect(result).toEqual({
      data: {
        posts: [
          {
            id: 1,
            title: "post #1",
            categories: [{ id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }],
          },
          {
            id: 2,
            title: "post #2",
            categories: [{ id: 3 }, { id: 4 }, { id: 5 }],
          },
          {
            id: 3,
            title: "post #3",
            categories: [{ id: 4 }, { id: 5 }],
          },
        ],
      },
    })
  })
  test("fetch by request > case #5 (complex input)", async () => {
    const postsRequest = App.requestFn("Posts", {
      posts: App.query("postsSearch", {
        id: true,
        title: true,
        categories: {
          id: true,
        },
      }),
    })

    const result = await fetcher!.fetch(
      postsRequest({
        posts: {
          keyword: "Hello",
          filter: {
            skip: 0,
            take: 5,
            active: null,
            ids: [1, 2],
            categoryIds: [{ id: 1 }, { id: 2 }],
          },
        },
      }),
    )
    expect(result).toEqual({
      data: {
        posts: [
          {
            id: 1,
            title: "post #1",
            categories: [{ id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }],
          },
          {
            id: 2,
            title: "post #2",
            categories: [{ id: 3 }, { id: 4 }, { id: 5 }],
          },
        ],
      },
    })
  })
  test("fetch by request > case #6 (multiple loaded data)", async () => {
    const postsRequest = App.requestFn("Posts", {
      firstPost: App.query("post", {
        id: true,
        title: true,
      }),
      secondPost: App.query("post", {
        id: true,
        title: true,
      }),
      nonExistPost: App.query("post", {
        id: true,
        title: true,
      }),
      posts: App.query("posts", {
        id: true,
        title: true,
      }),
    })

    const result = await fetcher!.fetch(
      postsRequest({
        firstPost: {
          id: 1,
        },
        secondPost: {
          id: 2,
        },
        nonExistPost: {
          id: 1000,
        },
        posts: {
          skip: 0,
          take: 5,
          active: null,
          ids: [1, 2],
        },
      }),
    )
    expect(result).toEqual({
      data: {
        firstPost: {
          id: 1,
          title: "post #1",
        },
        secondPost: {
          id: 2,
          title: "post #2",
        },
        nonExistPost: null,
        posts: [
          {
            id: 1,
            title: "post #1",
          },
          {
            id: 2,
            title: "post #2",
          },
          {
            id: 3,
            title: "post #3",
          },
        ],
      },
    })
  })
  test("fetch by request > case #7 (mutation)", async () => {
    const postsRequest = App.requestFn("Posts", {
      newPost: App.mutation("postCreate", {
        id: true,
        title: true,
      }),
      removedPost: App.mutation("postRemove"),
      allRemoved: App.mutation("postRemoveAll"),
    })

    const result = await fetcher!.fetch(
      postsRequest({
        newPost: {
          title: "New Post!",
        },
        removedPost: {
          id: 2,
        },
      }),
    )
    expect(result).toEqual({
      data: {
        newPost: {
          id: 1,
          title: "New Post!",
        },
        removedPost: true,
      },
    })
  })
  test("fetch by request > case #8 (subscription)", async () => {
    const postsRequest = App.requestFn("Posts", {
      onPostCreate: App.subscription("postCreated", {
        id: true,
        title: true,
      }),
    })

    // connect to websocket and wait a bit until connection is established
    await fetcher!.connect()
    await sleep(2000)

    // subscribe to changes
    let dataFromSubscription: any
    const observable = fetcher!.observe(postsRequest()).subscribe((data) => {
      dataFromSubscription = data
    })

    // send a query that will trigger event for the subscription
    const postSaveRequest = App.requestFn("Posts", {
      newPost: App.mutation("postCreate", {
        id: true,
        title: true,
      }),
    })
    const result = await fetcher!.fetch(
      postSaveRequest({
        newPost: {
          title: "iamtheonlyonepost",
        },
      }),
    )
    expect(result).toEqual({
      data: {
        newPost: {
          id: 1,
          title: "iamtheonlyonepost",
        },
      },
    })

    // let's wait a bit until subscriber receives a message
    await sleep(2000)

    // make sure subscription got its data
    expect(dataFromSubscription).toEqual({
      onPostCreate: {
        id: 1,
        title: "iamtheonlyonepost",
      },
    })
    observable.unsubscribe()
    await fetcher!.disconnect()
    await sleep(2000)
  }, 10000)
})
