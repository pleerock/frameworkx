# Subscriptions

Microframework uses [graphql-subscriptions](https://github.com/apollographql/graphql-subscriptions) package to implement subscriptions support.

* [Application server setup](#application-server-setup)
* [Subscriptions declaration](#subscriptions-declaration)
* [Creating a resolver](#creating-a-resolver)
* [Publishing events](#publishing-events)

## Application server setup

Add a `websocket` option in application server options:

```ts
const server = createApplicationServer(App, {
  // ...
  websocket: {
    host: "localhost",
    port: 5000,
    pubSub: AppPubSub,
  },
  // ...
})
```

`AppPubSub` can be any instance implementing `PubSub` interface. 
In this example we'll use 
[graphql-redis-subscriptions](https://github.com/davidyaha/graphql-redis-subscriptions) package:

```ts
import { RedisPubSub } from "graphql-redis-subscriptions"

export const AppPubSub = new RedisPubSub()
```

Later you can publish events using this instance:

```ts
AppPubSub.publish("USER_REGISTERED", user)
```

## Subscriptions declaration

After server setup you need to define subscription declarations in the [application declaration](application-declaration.md):

```ts
import { createApp } from "@microframework/core"

export const App = createApp<{
  // ...
  subscriptions: {
    onUserRegister(): User
    onUserSignIn(): User
    onUserLogout(): User
  }
  // ...
}>()
```

## Creating a resolver

Next step is to define resolvers for the newly created subscriptions:

```typescript
import { resolver } from "@microframework/core"
import { App } from "./app"

export const SubscriptionResolvers = resolver(App, {
  onUserRegister: {
    triggers: ["USER_REGISTERED"],
  },
  onUserSignIn: {
    triggers: ["USER_SIGNED_IN"],
  },
  onUserLogout: {
    triggers: ["USER_LOGGED_OUT"],
  }
})
```

Resolver describes what events trigger particular subscription.

You can also use a [filter](https://github.com/apollographql/graphql-subscriptions#filters)
 to make sure that each subscriber gets only the data it needs.

```typescript
import { resolver } from "@microframework/core"
import { App } from "./app"

export const SubscriptionResolvers = resolver(App, {
  onUserRegister: {
    triggers: ["USER_REGISTERED"],
    filter(user, context) {
      // allow an event to be received only by admins
      if (context.currentUser.isAdmin) {
        return true
      }
      return false
    }
  }
  // ...
})
```

## Publishing events

In order to trigger events, you must publish an event using defined `PubSub` interface:

```ts
AppPubSub.publish("USER_REGISTERED", user)
```

Once you publish an event, resolvers listening to the given triggers will be executed 
(subscribers will be filtered out if needed) and given data will 
be delivered to all subscribers. 