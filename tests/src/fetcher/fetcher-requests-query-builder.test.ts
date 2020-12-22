import { createFetcher, Fetcher } from "@microframework/fetcher"
import { ApplicationServer } from "@microframework/node"
import ws from "ws"
import { obtainPort, sleep } from "../util/test-common"
import { App } from "./fetcher-test-app/app"
import { AppServer } from "./fetcher-test-app/server"
import { PostList } from "./fetcher-test-app/repositories"

describe("fetcher > requests > query builder", () => {
  let webserverPort: number = 0
  let websocketPort: number = 0
  let server: ApplicationServer<any> | undefined = undefined
  let fetcher: Fetcher<typeof App> | undefined = undefined

  beforeEach(async () => {
    webserverPort = await obtainPort()
    websocketPort = await obtainPort()
    server = await AppServer(webserverPort, websocketPort).start()
    fetcher = createFetcher(App, {
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
    const result = await fetcher!
      .query("PostQuery")
      .add("firstPost")
      .postRandomOne()
      .select({
        id: true,
        title: true,
      })
      .fetch()

    expect(result).toEqual({
      data: {
        firstPost: {
          id: 1,
          title: "post #1",
        },
      },
    })
  })

  test("fetch by request > case #2 (loading array)", async () => {
    const result = await fetcher!
      .query("PostsQuery")
      .add("posts")
      .posts({
        skip: 0,
        take: 5,
        ids: [],
      })
      .select({
        id: true,
        title: true,
      })
      .fetch()

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
    const result = await fetcher!
      .query("PostsQuery")
      .add("posts")
      .posts({
        skip: 0,
        take: 5,
        ids: [],
      })
      .select({
        id: true,
        title: true,
        categories: {
          id: true,
        },
      })
      .fetch()

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
    const result = await fetcher!
      .query("PostsQuery")
      .add("posts")
      .posts({
        skip: 0,
        take: 5,
        active: true,
        ids: [],
      })
      .select({
        id: true,
        title: true,
        categories: {
          id: true,
        },
      })
      .fetch()

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
    const result = await fetcher!
      .query("PostsSearchQuery")
      .add("posts")
      .postsSearch({
        keyword: "Hello",
        filter: {
          skip: 0,
          take: 5,
          active: null,
          ids: [1, 2],
          categoryIds: [{ id: 1 }, { id: 2 }],
        },
      })
      .select({
        id: true,
        title: true,
        categories: {
          id: true,
        },
      })
      .fetch()

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
    const result = await fetcher!
      .query("ComplexQuery")
      .add("firstPost")
      .post({
        id: 1,
      })
      .select({
        id: true,
        title: true,
      })
      .add("secondPost")
      .post({
        id: 2,
      })
      .select({
        id: true,
        title: true,
      })
      .add("nonExistPost")
      .post({
        id: 1000,
      })
      .select({
        id: true,
        title: true,
      })
      .add("posts")
      .posts({
        skip: 0,
        take: 5,
        active: null,
        ids: [1, 2],
      })
      .select({
        id: true,
        title: true,
      })
      .fetch()

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
    const result = await fetcher!
      .mutation("PostsChange")
      .add("newPost")
      .postCreate({
        title: "New Post!",
      })
      .select({
        id: true,
        title: true,
      })
      .add("removedPost")
      .postRemove({
        id: 2,
      })
      .fetch()

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
    // connect to websocket and wait a bit until connection is established
    await fetcher!.connect()
    await sleep(2000)

    // subscribe to changes
    let dataFromSubscription: any
    const observable = fetcher!
      .subscription("PostSubscription")
      .add("onPostCreate")
      .postCreated()
      .select({
        id: true,
        title: true,
      })
      .observe()
      .subscribe((data) => {
        dataFromSubscription = data
      })

    // send a query that will trigger event for the subscription
    const postSaveRequest = App.request("Posts", {
      newPost: App.mutation("postCreate", {
        input: {
          title: "iamtheonlyonepost",
        },
        select: {
          id: true,
          title: true,
        },
      }),
    })
    const result = await fetcher!.fetch(postSaveRequest)
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

  test("fetch by request > case #9 (actions, GET)", async () => {
    const result = await fetcher!.action("GET /posts")
    expect(result).toEqual(PostList)
  })

  test("fetch by request > case #10 (actions, GET with parameter)", async () => {
    const result = await fetcher!.action("GET /posts/:id", {
      params: {
        id: 1,
      },
    })

    expect(result).toEqual(PostList.find((post) => post.id === 1))
  })

  test("fetch by request > case #11 (actions, GET with query param)", async () => {
    const result = await fetcher!.action("GET /posts-one-by-qs", {
      query: {
        id: 2,
      },
    })
    expect(result).toEqual(PostList.find((post) => post.id === 2))
  })
})
