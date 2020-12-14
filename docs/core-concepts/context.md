# Context

Context is a set of global variables used in a single request lifecycle.
Context type must be defined in the application declaration, 
and its variables can be used in any resolver.

* [Context definition in application declaration](#context-definition-in-application-declaration)
* [Resolving context properties](#resolving-context-properties)
* [Using context in resolvers](#using-context-in resolvers)
* [Default context](#default-context)

## Context definition in application declaration

Context variables must be defined in the [application declaration](application-declaration.md).
For example:

```ts
import { createApp } from "@microframework/core"

export const App = createApp<{
  // ...
  context: {
    currentUser: User
    // ... other context variables
  }
  // ...
}>()
```

## Resolving context properties

There are two ways how to set context values:

* dynamically in any resolver
* statically in a [context resolver](resolvers.md#context-resolver)

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

When context property resolved, resolving function accepts a `defaultContext` which contains `request` and `response` objects.
They are extremely helpful if you want to resolve data based on a user request.

Newly defined context resolver must be specified in the `resolvers` list of the
 [application server options](application-server.md#resolvers).

## Using context in resolvers

Context variable can be used in root and model [resolvers](resolvers.md).


Example #1:

```typescript
import { resolver } from "@microframework/core"
import { App } from "./app"

export const PostsRootResolver = resolver(App, "posts", (args, context) => {
  // todo: use context here
  return [ /* ... */ ]
})
```

Example #2:

```typescript
import { resolver } from "@microframework/core"
import { App } from "./app"

export const PostsRootResolver = resolver(App, {
  post(args, context) {
    // todo: use context here
    return { /* ... */ }
  },
  posts(context) {
    // todo: use context here
    return [ /* ... */ ]
  },
  postRemove(args, context) {
    // todo: use context here
    return {  /* ... */  }
  }
})
```

Example #3:

```typescript
import { resolver } from "@microframework/core"
import { App } from "./app"

export const PostsGetActionResolver = resolver(App, {
  ["GET /post/:id"]({ params }, context) {
    // todo: use context here
    return { /* ... */ }
  },
  ["GET /posts"](args, context) {
    // todo: use context here
    return [ /* ... */ ]
  },
  ["DELETE /posts/:id"]({ params }, context) {
    // todo: use context here
    return { /* ... */ }
  }
})
```

Example #4:

```typescript
import { resolver } from "@microframework/core"
import { App } from "./app"

export const UserModelResolver = resolver(App, "User", {
  fullName(user, context) {
    // todo: use context here
    return user.firstName + " " + user.lastName
  }
})
```

Note: in resolver function of a root declaration,
context is a **first argument** if resolved definition *doesn't have* an args defined,
or it's a **second argument** if resolved definition *has* args.

## Default context

Even if you don't define a context in the application declaration, 
there is a `context` variable with a following default variables:

* `context.request` - contains Express's `Request` object  
* `context.response` - contains Express's `Response` object  
* `context.logger` - contains a [Logger](logging.md) that can be used to log even particularly to this request lifecycle  

As with custom defined context variables, you can use default context variables in any resolver.