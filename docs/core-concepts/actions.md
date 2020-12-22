# Actions

Actions allow to create a RESTful / WebAPI endpoints in your application.

* [Action declaration](#action-declaration)
* [Action declaration options](#action-declaration-options)
* [Action resolvers](#action-resolvers)
* [Generating Swagger documentation](#generating-swagger-documentation)

## Action declaration

First you need to define action in the [application declaration](application-declaration.md).
Example of such declaration is:

```typescript
export const App = createApp<{
  // ...
  actions: {
    "GET /posts": {
      return: Post[]
    }
    "GET /posts/:id": {
      query: {
        id: number
      }
      return: Post
    }
    "POST /posts": {
      return: Post
    }
    "PUT /posts/:id": {
      params: {
        id: number
      }
      return: Post
    }
    "DELETE /posts/:id": {
      params: {
        id: number
      }
      return: {
        status: string
      }
    }
  }
  // ...
}>
```

Each action name must be in a following format: `$METHOD /$ROUTE`, 
where `$METHOD` is a http method like `GET`, `POST`, `PUT`, `DELETE`, etc. 
and  `$ROUTE` is a http route. Route can also contain params.

Each action declaration must define a `return` property.
If action accepts `params`, `query params` or `body`, their types must be defined in the action declaration as well. 
If action returns `headers` or `cookies`, their types must be defined as well. 

## Action declaration options

A following options can be defined in a single action declaration:

* `return` - must define what a particular action declaration returns. 
E.g. if your route suppose tor return a list of users, it should be `return: User[]`. 

* `params` - every param you defined in the route must be defined in this option. 
E.g. for `/album/:albumName/photos/:photoId` you must define 
a following params: `params: { albumName: string, photoId: number }`. 

* `query` - every query param your action accepts must be defined in there. 
E.g. for `/posts/?order=latest&from=10` you must define 
a following query params: `query: { order: string, from: number }`.

* `body` - if your action accepts a body, the type of the accepted object must be defined in this option.
E.g. for `POST /user-register` action you can define 
a following body: `body: UserRegisterInput`.

* `headers` - if your action returns headers, their type must be defined in this option.
E.g. if you return `Authorization` header, you should define 
a following body: `headers: { Authorization: string }`.

* `cookies` - if your action returns cookies, their type must be defined in this option.
E.g. if you return `authToken` cookie, you should define 
a following body: `cookies: { authToken: string }`.

## Action resolvers

To provide an implementation logic for the defined resolvers,
you must create a [resolver](resolvers.md) for your actions.

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

## Generating Swagger documentation

Microframework can automatically generate a Swagger API documentation.
To enable documentation generation you must specify `swagger.route` 
option in the [application server](application-server.md) options:

```typescript
export const AppServer = createApplicationServer(App, {
  // ...
  swagger: {
    route: "/api-docs",
  },
  // ...
})
```

Then you can open http://localhost:4000/api-docs in your browser to access api docs.
