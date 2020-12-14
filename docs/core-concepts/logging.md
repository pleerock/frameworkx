# Logging

Microframework ships with a basic logging system you can use to log events in your application.
By default, there is a `@microframework/logger` package which 
internally uses [debug](https://github.com/visionmedia/debug) package.

There are two types of loggers:

* [Application logger](#application-logger)
* [Context logger](#context-logger)

## Application logger

Application logger is a property in [application server](application-server.md) that you can use in your codebase
to log any events using default logging package.

There are 4 types of logging levels:

* `log` - used to log debug events
* `info` - used to log more important events
* `warning` - used to log non-critical errors, e.g. warnings
* `error` -  used to log critical errors

To use application logger simply use `.logger` of Application Server:

```typescript
import { resolver } from "@microframework/core"
import { App } from "./app"
import { AppServer } from "./app-server"

export const PostsRootResolver = resolver(App, {
  posts(context) {
    AppServer.logger.warning("SOMETHING_HAPPENED", "omg user requested posts")
    return [ /* ... */ ]
  },
})
```
## Context logger

Context logger is a logger that lives in a single request lifecycle.
This type of logger is useful when you want to log something in terms of a single user request.
To use this type of logger, you need to use a `context` variable of any resolver, for example:

```typescript
import { resolver } from "@microframework/core"
import { App } from "./app"

export const PostsRootResolver = resolver(App, {
  posts(context) {
    context.logger.log("User requested posts")
    return [ /* ... */ ]
  },
})
```

As with application logger, there are `log`, `info`, `warning` and `error` logging levels.