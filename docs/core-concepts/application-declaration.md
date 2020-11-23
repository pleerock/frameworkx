# Application declaration

Any Microframework application must define an application declaration.

Application declaration is a place where you must describe all your application:

* [Models](#models)
* [Inputs](#inputs)
* [Queries, Mutations and Subscriptions](#queries-mutations-and-subscriptions)
* [RESTful API](#restful-api)
* [Context](#context)

Application declaration **must** be defined in a separate file with a single exported constant.
This file will be parsed by Microframework in runtime.

Application declaration created by using `createApp` function from `@microframework/core` package:

```ts
import { createApp } from "@microframework/core"

export const App = createApp<{
  models: {
    // register models here
  }
  inputs: {
    // register inputs here
  }
  queries: {
    // register GraphQL queries here
  }
  mutations: {
    // register GraphQL mutations here
  }
  subscriptions: {
    // register GraphQL subscriptions here
  }
  actions: {
    // register RESTful endpoints here
  }
  context: {
    // register context variables here
  }
}>()
```

## Models

Any application consist of models.
Model is a type / interface / class declaration for the domain object in your app.
Models used in GraphQL and REST declarations as return types.
In Microframework we define a model in the following manner:

```typescript
export type Post = {
  id: number
  title: string
  text: string
  isApproved: boolean
  createdAt: Date
}
```

In GraphQL this declaration is the same as:

```graphql
type Post {
  id: Int!
  title: String!
  text: String!
  isApproved: Boolean!
  createdAt: Date!
}
```

Once model defined, it needs to be registered in the application declaration:

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

Multiple models defined in the following manner:

```typescript
import { createApp } from "@microframework/core"
import { Post } from "./model/Post"
import { Category } from "./model/Category"
import { User } from "./model/User"

export const App = createApp<{
  // ...
  models: {
    Post: Post
    Category: Category
    User: User
  }
  // ...
}>()
```

Also, it's worth noting, that left and right operand names must match,
e.g. you cannot define `PostModel: Post`, you **must** define it as a `Post: Post`.
You can read more about models [here](models.md).

## Inputs

Inputs are pretty much similar to [models](#models), but conceptually different.
Input is a type / interface / class declaration for the *user input*.
It's the same model, but for a user input.
In Microframework we define an input in the following manner:

```typescript
export type PostCreateInput = {
  title: string
  text: string
}
```

In GraphQL this declaration is the same as:

```graphql
input PostCreateInput {
  title: String!
  text: String!
}
```

Once input defined, it needs to be registered in the application declaration:

```typescript
import { createApp } from "@microframework/core"
import { PostCreateInput } from "./input/PostCreateInput"

export const App = createApp<{
  // ...
  inputs: {
    PostCreateInput: PostCreateInput
  }
  // ...
}>()
```

Multiple inputs defined in the following manner:

```typescript
import { createApp } from "@microframework/core"
import { PostCreateInput } from "./input/PostCreateInput"
import { PostUpdateInput } from "./input/PostUpdateInput"
import { UserRegisterInput } from "./input/UserRegisterInput"

export const App = createApp<{
  // ...
  inputs: {
    PostCreateInput: PostCreateInput
    PostUpdateInput: PostUpdateInput
    UserRegisterInput: UserRegisterInput
  }
  // ...
}>()
```

Also, it's worth noting, that left and right operand names must match,
e.g. you cannot define `PostSave: PostCreateInput`, you **must** define it as a `PostCreateInput: PostCreateInput`.
You can read more about inputs [here](inputs.md).

## Queries, Mutations and Subscriptions

Once your application models and inputs defined, 
you might want to define some queries to load them 
and mutations to change their state.

Queries defined in `queries` section of application declarations this way:

```typescript
import { createApp } from "@microframework/core"
import { Post } from "./model/Post"

export const App = createApp<{
  // ...
  queries: {
    post(args: { id: number }): Post | null
  }
  // ...
}>()
```

Mutations and subscriptions syntax is similar.

```typescript
import { createApp } from "@microframework/core"
import { Post } from "./model/Post"

export const App = createApp<{
  // ...
  mutations: {
    postCreate(args: { post: PostCreateInput }): Post
  }
  // ...
}>()
```

Every query / mutation item must be a method declaration with optional arguments and required return type.
Return type can be any [model](#models) or primitive, like `number`, `boolean` or `string`.

Complete example looks this way:

```typescript
import { createApp } from "@microframework/core"
import { Post } from "./model/Post"
import { PostCreateInput } from "./input/PostCreateInput"

export const App = createApp<{
  models: {
    Post: Post
  }
  inputs: {
    PostCreateInput: PostCreateInput
  }
  queries: {
    post(args: { id: number }): Post | null
    posts(args: PostCreateInput): Post[]
  }
  mutations: {
    postCreate(args: { post: PostCreateInput }): Post
    postRemove(args: { id: number }): boolean
    postRemoveAll(): boolean
  }
  subscriptions: {
    postCreated(): Post
    postRemoved(): Post
  }
}>()
```

Above declaration will generate a following GraphQL:

```graphql
type Query {
  post(id: Int!): Post
  posts(title: String!, text: String!): [Post!]!
}
type Mutation {
  postCreate(post: PostCreateInput!): Post!
  postRemove(id: Int!): Boolean!
  postRemoveAll: Boolean!
}
type Subscription {
  postCreated: Post!
  postRemoved: Post!
}
```

Once you define your declarations, you might want to create a [server](application-server.md) and 
[resolvers](resolvers.md) to resolve declarations. 

## RESTful API

Generally, for 95% cases in your DDD applications you might want to use GraphQL.
For other 5% cases there is a support for classic REST / WebAPI HTTP endpoints.

They are defined in `actions` section of application declaration:

```typescript
import { createApp } from "@microframework/core"
import { Post } from "./models/Post"

export const App = createApp<{
  // ...
  actions: {
    "GET /posts": {
      return: Post[]
    }
    "GET /posts/:id": {
      params: {
        id: number
      }
      return: Post
    }
    "POST /posts": {
      body: PostCreateInput
      return: boolean
    }
  }
  // ...
}>()
```

Action is a single HTTP route definition.

Every action name most contain an HTTP Method name (`GET` or `POST` from above example)
following by a route path. Route path might contain params.

Action must also define what `route params`, `query params`, `headers` and `body` it accepts, 
as well as what content model it returns. 

You can read more about actions [here](actions.md).

## Context

Context is a type definition for the variables used across resolvers,
here in application declaration we must define types for these variables.
Context is a holder for the global variables, 
try to avoid using it if the data you are trying to store in the context isn't really global.

```typescript
import { createApp } from "@microframework/core"
import { User } from "./models/User"

export const App = createApp<{
  // ...
  context: {
    currentUser: User
  }
  // ...
}>()
```

You can read more about context [here](context.md).