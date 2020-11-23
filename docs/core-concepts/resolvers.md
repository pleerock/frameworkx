# Resolvers

Resolvers are similar to "controllers" from a classic MVP-based frameworks.
Once you define your queries / mutations / subscriptions / actions / models you need to provide 
an actual logic that will run when client those queries / mutations / subscriptions / actions / models.

There are many ways how you can define resolvers. 

* [Resolver types](#resolver-types)
* [Single item root resolver](#single-item-root-resolver)
* [Multiple items root resolver](#multiple-items-root-resolver)
* [Subscription resolve syntax](#subscription-resolve-syntax)
* [Action resolve syntax](#action-resolve-syntax)
* [Model resolver](#model-resolver)
* [Data loader model resolver](#data-loader-model-resolver)
* [Context resolver](#context-resolver)
* [Register resolvers](#register-resolvers)

## Resolver types

There are 3 types of resolvable objects:

* root resolvers
* model resolvers
* context resolver

**Root resolver** provides a logic for the defined queries, mutations, subscriptions and actions.
Example declaration:

```typescript
import { createApp } from "@microframework/core"
import { Post } from "./model/Post"
import { PostCreateInput } from "./input/PostCreateInput"

export const App = createApp<{
  // ...
  queries: {
    post(args: { id: number }): Post | null
    posts(args: PostCreateInput): Post[]
  }
  mutations: {
    postRemove(args: { id: number }): boolean
  }
  subscriptions: {
    onPostRemove(): Post  
  }
  // ...
}>()
```

**Model resolvers** resolve *properties* of defined models.
Example declaration:

```typescript
import { createApp } from "@microframework/core"
import { Post } from "./model/Post"

export const App = createApp<{
  // ...
  models: {
    Post: Post
  }
  // ...
}>()
```

**Context resolver** is used to create a resolver for context variables.
Example declaration:

```typescript
import { createApp } from "@microframework/core"
import { User } from "./model/User"

export const App = createApp<{
  // ...
  context: {
    currentUser: User
  }
  // ...
}>()
```

## Single item root resolver

Single item root resolver resolves a single query / mutation / subscription / action declaration.
Example:

```typescript
import { resolver } from "@microframework/core"
import { App } from "./app"

export const PostsRootResolver = resolver(App, "posts", () => {
  return [
    { id: 1, title: "Post #1" },
    { id: 2, title: "Post #2" },
  ]
})
```

Resolver function can be `async`.

## Multiple items root resolver

If you want to combine multiple root item resolvers in the single file,
you might want to use a special syntax:

```typescript
import { resolver } from "@microframework/core"
import { App } from "./app"

export const PostsRootResolver = resolver(App, {
  post({ id }, context) {
    return { id: id, title: "Post #" + id }
  },
  posts(context) {
    return [
      { id: 1, title: "Post #1" },
      { id: 2, title: "Post #2" },
    ]
  },
  postRemove({ id }, context) {
    // todo: remove a post from the database...
    return { id }
  }
})
```

Few things to note:

* your application declaration cannot have queries or mutations named the same way,
that's why you are free to resolve query or mutation in a single object
* if single declaration item has `args`, it will be passed as a first argument to a resolving function.
If there are no `args` in item declaration, first argument to a resolving function will be a `context`. 
* everything is type-safe. In resolving functions you don't have to return
 a complete model structure, since model properties can be resolved by a [model resolvers](#model-resolver). 

## Subscription resolve syntax

Resolvers for subscriptions have a bit different syntax:

```typescript
import { resolver } from "@microframework/core"
import { App } from "./app"

export const PostRemovedRootResolver = resolver(App, "postRemoved", {
  triggers: ["POST_REMOVED"],
})
```

For subscription resolvers we must define on what `triggers` the resolver function
will be executed for listened clients.

We can also define a `filter` function that will filter data out before resolving it to the client:

```typescript
import { resolver } from "@microframework/core"
import { App } from "./app"

export const PostRemovedSubscriptionResolver = resolver(App, "postRemoved", {
  triggers: ["POST_REMOVED"],
  filter(post, context) {
    // allow an event to be received only by admins
    if (context.currentUser.isAdmin) {
      return true
    }
    return false
  }
})
```

Read more about how to use subscriptions [here](application-server.md#subscriptions). 

## Action resolve syntax

Single action can be resolved this way:

```typescript
import { resolver } from "@microframework/core"
import { App } from "./app"

export const PostsGetActionResolver = resolver(App, "GET /posts", () => {
  // todo: load posts from a database
  return [
    { id: 1, title: "Post #1" },
    { id: 2, title: "Post #2" },
  ]
})
```

Multiple actions resolved this way:

```typescript
import { resolver } from "@microframework/core"
import { App } from "./app"

export const PostsGetActionResolver = resolver(App, {
  ["GET /post/:id"]({ params }, context) {
    return { id: params.id, title: "Post #" + id }
  },
  ["GET /posts"](args, context) {
    return [
      { id: 1, title: "Post #1" },
      { id: 2, title: "Post #2" },
    ]
  },
  ["DELETE /posts/:id"]({ params }, context) {
    // todo: remove a post from the database...
    return { id: params.id }
  }
})
```


Read more about how to use actions [here](application-server.md#actions).
 
## Model resolver

Model resolver resolves declared model properties which were not resolved by root resolvers.
  
```typescript
import { resolver } from "@microframework/core"
import { App } from "./app"

export const UserModelResolver = resolver(App, "User", {
  fullName(user, context) {
    return user.firstName + " " + user.lastName
  }
})
```

Resolver functions can be `async`.

## Data loader model resolver

Data loader is a [facebook pattern]() for providing a resolve logic for multiple model properties at once.

```typescript
import { resolver } from "@microframework/core"
import { App } from "./app"

export const UserModelResolver = resolver(
  App, 
  { name: "User", dataLoader: true }, 
  {
    fullName(users, context) {
      return users.map(user => user.firstName + " " + user.lastName)
    }
  }
)
```

## Context resolver

Context properties resolved using `context` resolver: 

```typescript
import { contextResolver } from "@microframework/core"
import { App } from "./app"

export const ContextResolver = contextResolver(App, {
  async currentUser({ request, response }) {
    // todo: get user based on request.headers.authorization
    return {
      id: 1,
      name: "Timber"
    }
  }
})
```

## Register resolvers

All resolvers must be registered in the [application server](application-server.md):

```typescript
export const AppServer = createApplicationServer(App, {
  // ...
  resolvers: [
    PostRootResolver,
    UserRootResolver,
    UserModelResolver,
    ContextResolver,
  ],
  // ...
})
```