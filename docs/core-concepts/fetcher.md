# Fetcher

Microframework provides a `fetcher` package that helps to execute queries against application server.
It can be used in the browser, mobile (react native or ionic) or another server.
It also can be used to execute cross-server requests in microservices architecture.

* [Installation](#installation)
* [Creating a Fetcher](#creating-a-fetcher)
* [Creating a Request](#creating-a-request)
* [Request types](#request-types)
* [Type safety](#type-safety)
* [Using WebSockets](#using-websockets)
* [Using unsafe methods](#using-unsafe-methods)
* [Using helper types](#using-helper-types)

## Installation

Install `@microframework/fetcher` package in order to use `Fetcher`:

```shell script
npm i @microframework/fetcher
```

## Creating a Fetcher

`Fetcher` allows performing following operations:

* execute GraphQL queries, mutations and subscriptions
* execute REST / WebAPI calls (e.g. actions)
* establish a WebSocket connection

You can have multiple fetcher instances in your app, connected to a different servers.
To create a new fetcher instance use `createFetcher` function:

```typescript
import { createFetcher } from "@microframework/fetcher"

export const AppFetcher = createFetcher({
  clientId: "MY_CLIENT_APP",
  actionEndpoint: `http://localhost:${webserverPort}`,
  graphqlEndpoint: `http://localhost:${webserverPort}/graphql`,
  websocketEndpoint: `ws://localhost:${websocketPort}/subscriptions`,
})
```

* `clientId` is a unique identifier of a connected client.
Value is optional, and used mostly for debugging purpose.  
* `actionEndpoint` is the endpoint against which Fetcher will execute action queries.
* `graphqlEndpoint` is the endpoint against which Fetcher will execute GraphQL queries and mutations.
* `websocketEndpoint` is the endpoint against which Fetcher will execute GraphQL subscriptions.

Once fetcher instance created, you can use it anywhere in your app to execute queries.

## Creating a Request

Fetcher allows executing GraphQL queries and mutations in a 3 different ways:

* using `gql` tag:
    
    ```typescript
    import gql from "graphql-tag"
    import { AppFetcher } from "./AppFetcher"
    
    // ...
    
    const { data } = await AppFetcher.fetch(gql`
      query {
        posts {
          id
          title
        }
      }
    `)
    
    console.log("loaded posts:", data.posts)
    ```
    
    To use `gql` you must install a `graphql-tag` package.
    This approach is most familiar if you have worked with GraphQL before,
    but it doesn't provide automatic type inference. 

* using separate request definitions:
    
    ```typescript
    import { request, query } from "@microframework/core"
    import { App } from "./App"
    import { AppFetcher } from "./AppFetcher"
    
    const postsRequest = request("PostsRequest", {
      firstPost: query(App, "post", {
        input: {
          id: 1
        }, 
        select: {
          id: true,
          title: true,
        },
      }),
      secondPost: query(App, "post", {
        input: {
          id: 2
        }, 
        select: {
          id: true,
          title: true,
        },
      }),
      allPosts: query(App, "posts", {
        select: {
          id: true,
          title: true,
        },
      }),
    })
    
    const { data } = await fetcher.fetch(postsRequest)
    console.log("first post:", data.firstPost)
    console.log("second post:", data.secondPost)
    console.log("all posts:", data.allPosts)
    ```
    
    In this example we created a request called `PostsRequest`.
    This request loads several things:
    
    * post with id = 1 (query to `post(id: 1)`)
    * post with id = 2 (query to `post(id: 2)`)
    * all posts (query to `posts`)

    From the posts we only take `id` and `title` properties.
    This syntax is helpful when you separate request definitions or want to reuse them.
    All the types returned in `data` property are type-safe.

* using query builder

    ```typescript
    const { data } = await fetcher
      .query("PostsRequest")
      .add("firstPost")
      .post({
        id: 1
      })
      .select({
        id: true,
        title: true,
      })
      .add("secondPost")
      .post({
        id: 2
      })
      .select({
        id: true,
        title: true,
      })
      .add("posts")
      .posts()
      .select({
        id: true,
        title: true,
      })
      .fetch()
    
    console.log("first post:", data.firstPost)
    console.log("second post:", data.secondPost)
    console.log("all posts:", data.allPosts)
    ```
  
    This is an absolute equivalent of previous example, but using *query builder* syntax.
    `PostsRequest` is a request name, and we loaded all the same data as in previous example:
    
    * post with id = 1 (query to `post(id: 1)`)
    * post with id = 2 (query to `post(id: 2)`)
    * all posts (query to `posts`)

    From the posts we only take `id` and `title` properties.
    This syntax is helpful when you want to have as less code as possible directly using `fetcher`.
    All the types returned in `data` property are type-safe.
    
## Request types

There are 4 operators you can use with the request:

* `query` - creates a GraphQL query. Example:

```typescript
import { request, query } from "@microframework/core"
import { App } from "./App"

const postsRequest = request("PostsRequest", {
  post: query(App, "post", {
    input: {
      id: 1
    }, 
    select: {
      id: true,
      title: true,
    },
  }),
})
```
    
* `mutation` - creates a GraphQL mutation. Example:

```typescript
import { request, mutation } from "@microframework/core"
import { App } from "./App"

const postSaveRequest = request("PostSaveRequest", {
  savedPost: mutation(App, "postSave", {
    input: {
      title: "New post",
      text: "About this post"
    }, 
    select: {
      id: true,
      title: true,
    },
  }),
})
```
    
* `subscription` - creates a GraphQL subscription. Example:

```typescript
import { request, subscription } from "@microframework/core"
import { App } from "./App"

const postSaveSubscriptionRequest = request("PostSaveSubscriptionRequest", {
  post: subscription(App, "onPostSave", {
    select: {
      id: true,
      title: true,
    },
  }),
})
```

Unlike other request types, request using `subscription` returns `Observable` instead of `Promise`.
To use observables and subscriptions use `fetcher.observe` instead of `fetcher.fetch` method.

* `action` - creates an action to HTTP route. Example:

```typescript
import { request, action } from "@microframework/core"
import { App } from "./App"

const postsRequest = request(
  action(App, "GET /posts/:id", {
    params: {
      id: 1,
    },
  }),
)
```

A single request **cannot** mix different request types.

## Type safety

Both `fetch` and `observe` methods return data typed *properly*.
Properly typed mean you have back what you actually requested.
For example, a given model:

```typescript
export type Post = {
  id: number
  title: string
  text: string
}
```

And a given declaration:

```typescript
export const App = createApp<{
  models: {
    Post: Post
  },
  queries: {
    post(): Post
  }
}>
```

For a following request:

```typescript
import { request, query } from "@microframework/core"
import { App } from "./App"
import { AppFetcher } from "./AppFetcher"

const { data } = await AppFetcher.fetch(
  request("PostRequest", {
    post: query(App, "post", {
      input: {
        id: 1
      }, 
      select: {
        id: true,
        title: true,
      },
    }),
  })
)
```

Types the `data` with a following type:

```typescript
/*typeof data: */ {
  post: {
   id: number
   title: string
  }
}
```

As you can see a `fetch` method doesn't return a `Post` as you might expect.
It doesn't return a type that completely match `Post` type.
It returns a new **dynamic** type based on what you actually selected.
This is a **true** type-safety.

## Using WebSockets

Fetcher provides a functionality to establish a WebSocket connection and work with it.
Use the following Fetcher methods:

* `connect` - to establish WebSocket connection
* `disconnect` - to disconnect from a previously established connection

To execute a WebSocket query use `observe` method.

## Using unsafe methods

Sometimes you might want to avoid using [type-safe](#type-safety) queries.
In this case you can use following Fetcher methods:

* `fetchUnsafe` - same as `fetch` method, but returns an unsafe type
* `observeUnsafe` - same as `observe` method, but returns an unsafe type

Unsafe type is what your declaration defines. E.g. for a `post(): Post` declaration,
Fetcher returns you a `Post` type instead of type built from what you actually selected.
This behaviour isn't reflected on a real data however, 
the real data structure will match with what you have selected.

## Using helper types

There are several helper types that allows you to *extract* the **request type** into separate variable.
For example, for a following request:

```typescript
import { request, query, RequestReturnType } from "@microframework/core"
import { App } from "./App"
import { AppFetcher } from "./AppFetcher"

const postRequest = request("PostRequest", {
 myPost: query(App, "post", {
    input: {
      id: 1
    }, 
    select: {
      id: true,
      title: true,
    },
  }),
})

type PostRequestType = RequestReturnType<typeof postRequest, "myPost">
```

Here `PostRequestType` type will have a following type structure: 

```typescript
{
  id: number
  title: string
}
```

This type is useful when you want to reuse actual returned type across different parts of your application.

There are few other helper types, which can be used in a different situations:

* `RequestOriginType<typeof yourRequest, "requestItemName">` - 
returns original type defined in the declaration (instead of "selected type") 
* `RequestMapReturnType<typeof yourRequest>` - 
returns a map of selection types for a given request
* `RequestMapOriginType<typeof yourRequest>` - 
returns a map of original declaration types for a given request