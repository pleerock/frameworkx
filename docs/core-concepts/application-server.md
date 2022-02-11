# Application server

* [`appPath` option](#apppath-option)
* [Web Server](#web-server)
* [WebSocket Server](#websocket-server)
* [GraphQL setup](#graphql-setup)
* [Resolvers](#resolvers)
* [Swagger API](#swagger-api)
* [Rate limitation](#rate-limitation)
* [Application Server Options](#application-server-options)

Once application declaration defined, and 
you have created resolvers for your queries / mutations / subscriptions / actions
you need to create a server that will launch everything:

```typescript
export const AppServer = createApplicationServer(App, {
  appPath: __dirname + "/App",
  webserver: {
    port: 4000,
    cors: true,
  },
  graphql: {
    graphiql: true,
  },
  resolvers: [
    // ...
  ],
})
```

To start a server:

```typescript
AppServer
  .start()
  .then(() => {
    console.log(
      "Running at http://localhost:4000/graphql",
    )
  })
  .catch((error) => {
    console.error(error)
  })
```

Once server started, launch the app and open `http://localhost:4000/graphql` in your browser.
Now your clients are able to execute queries against an API.

## `appPath` option

Microframework works based on [application declaration](application-declaration.md) you've defined.
In order for application server to work properly you **must** provide a filepath to the application declaration.
Filename must not contain an extension. Make sure filename you specify available in the
runtime relatively to your app server path (this is critical when you are using `outDir` option in tsconfig).
For example, if you define application declaration in a file called `App.ts`, 
you should provide a following `appPath`:

```typescript
export const AppServer = createApplicationServer(App, {
  // ...
  appPath: __dirname + "/App",
  // ...
})
```

You don't need to specify an extension because framework automatically picks one which is available.
Possible file extensions are: `.ts`, `.d.ts`, `.json`: 

* `.ts` extension used when your source code is available in a runtime, 
for example when you run the app through the `ts-node` package.
* `.d.ts` extension used when in runtime `.ts` files aren't available,
for example if you ship the package to the server without source code,
or execute code from a directory other than where source code placed (e.g. use of `outDir` compiler option).  
To make this option work you must enable `declaration: true` in tsconfig file.
* `.json` extension used when there is a `.json` file with application metadata is available.
You can generate application metadata file using [CLI commands](cli.md).
This option is most performant when you execute the framework in a serverless environment. 

## Web Server

In order for a WebServer to run, you must provide a `port` option.

```typescript
export const AppServer = createApplicationServer(App, {
  // ...
  webserver: {
    port: 4000,
  },
  // ...
})
```

This will setup Express server on port `4000`.

## WebSocket Server

In order for a WebSocket server to run, you must provide `host` and `port` options.

```typescript
export const AppServer = createApplicationServer(App, {
  // ...
  websocket: {
    host: "localhost",
    port: 5000,
  },
  // ...
})
```

This will setup WebSocket server on `localhost:5000`.

## GraphQL setup

GraphQL is automatically set up if you registered queries / mutations / subscriptions
in the application declaration. By default, GraphQL is registered by a `/graphql` route, but you can change this: 

```typescript
export const AppServer = createApplicationServer(App, {
  // ...
  graphql: {
    route: "/api/graphql",
  },
  // ...
})
```

You can also enable [GraphiQL](https://github.com/graphql/graphiql) and [GraphQL Playground](https://github.com/graphql/graphql-playground)
 by setting `graphiql: true` and `playground: true` options.

## Resolvers

Once you define resolvers for declared queries / mutations / subscriptions / actions,
you must register them in the application server:

```typescript
export const AppServer = createApplicationServer(App, {
  // ...
  resolvers: [
    PostRootResolver,
    CategoryRootResolver,
    UserModelResolver,
  ],
  // ...
})
```

Read more about resolvers [here](resolvers.md).

## Swagger API

Microframework can automatically generate a Swagger API documentation for the 
[actions](actions.md) defined in the application declaration.
To enable documentation generation you must specify `swagger.route` option:

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

## Rate limitation

Microframework supports endpoint rate limitation out of the box.
In order to enable install `rate-limiter-flexible` package and all related dependencies,
and set a `rateLimitConstructor` option:

```typescript
import { RateLimiterRedis } from "rate-limiter-flexible"
const Redis = require("ioredis")
const redisClient = new Redis()

export const AppServer = createApplicationServer(App, {
  // ...
  rateLimitConstructor: (options) => {
    return new RateLimiterRedis({
      storeClient: redisClient,
      ...options,
    })
  },
  // ...
})
```

Then you can set rate limitation per any query / mutation / subscription / action you have, for example:

```typescript
export const AppServer = createApplicationServer(App, {
  // ...
  rateLimits: {
      queries: {
        post: {
          points: 10, // Number of points
          duration: 1, // Per second
        },
      },
      mutations: {
        postSave: {
          points: 10, // Number of points
          duration: 1, // Per second
        },
      },
  }
  // ...
})
```

## Application Server Options

* `appPath: string` - file path to application declaration file. 
Provided path should not contain an extension.
In the JavaScript runtime must point to .d.ts file 
or .json file with the generated metadata. 
Read more about this option [here](#apppath-option).

* `webserver` contains express server options:

    * `port: number` - port on which to run express server.

    * `cors?: boolean | CorsOptions` - indicates if CORS should be enabled or not.
        You can pass CORS options to configure how CORS are going to work. 
        See [CORS documentation](https://github.com/expressjs/cors) for more information.

    * `staticDirs?: { [route: string]: string }` - list of static directories to register in the Express server.
        See [Express Static](https://expressjs.com/en/starter/static-files.html) for more information.
    
    * `middlewares?: any[]` - list of middlewares to register in the app per each route / action.

    * `actionMiddleware?: { [route: string]: any[] }` - list of middlewares to register per specific route / action.

    * `express?: Express` - custom express server instance.
        You can create and configure your own instance of express and framework will use it.
        If not passed, default express server will be used.

* `graphql` contains GraphQL setup options:

    * `route?: string` - route on which to register a GraphQL request handler.
        If not set, default is "/graphql".

    * `graphiql?: boolean` - indicates if [GraphiQL](https://github.com/graphql/graphiql) should be enabled or not.
        Default is false.

    * `playground?: boolean` - indicates if [GraphQL Playground](https://github.com/graphql/graphql-playground) 
        should be enabled or not. Default is false.

    * `options?: Partial<OptionsData>` - additional [options](https://github.com/graphql/express-graphql#options)
        for GraphQL middleware.

* `websocket` - can be set to use a WebSocket server.

    * `host: string` - WebSocket host. For example, "localhost".

    * `port: number` - port on which to run websocket server.

    * `path?: string` - route on which to register subscriptions WebSocket interface.
        If not set, default is "/subscriptions".

    * `options?: Partial<ServerOptions>` - additional WebSocket server options.

    * `pubSub?: PubSubEngine` - PubSub to be used for subscriptions.

    * `disconnectTimeout?: number` - when a connected user doesn't respond in a time,
        he will be disconnected from a WebSocket. Server and client must exchange with "ping"/"pong" messages.
        See details [here](https://github.com/websockets/ws#how-to-detect-and-close-broken-connections).

    * `websocketServer?: any` - custom WebSocket server instance. 
        If not specified, a default WebSocket server instance will be created.

* `swagger` - Swagger settings.

    * `route: string` - route on which to register Swagger api documentation.

    * `document?: string` - Swagger document (e.g. use document: require("./swagger.json")).
        This document will be merged into the document automatically generated by a framework.

    * `options?: any` - extra [swagger-ui-express options](https://github.com/scottie1984/swagger-ui-express#custom-swagger-options).

* `dataSource?: DataSource | (() => Promise<DataSource>)` - 
    TypeORM's DataSource used in the application.

* `entities?: (Function | string | EntitySchema)[]` - list of entities to register in connection.

* `resolvers: AppResolverType[]` - list of [resolvers](resolvers.md) to register in the app server.

* `validationRules?: ValidationRule[]` - list of [validation rules](validation.md).

* `validator?: ValidationFn<any>` - validation library to be used in the application.
    If not specified, default validator will be used.

* `logger?: Logger` - logger to be used in the application.
    If not specified, default logger will be used.

* `namingStrategy?: NamingStrategy` - Strategy for naming special identifiers used in the framework.
    If not specified, default naming strategy will be used.

* `errorHandler?: ErrorHandler` - handling errors logic.
    If not specified, default error handler will be used.

* `generateModelRootQueries?: boolean` - indicates if framework should automatically generate 
    root queries and mutations for your models.

* `maxGeneratedConditionsDeepness?: number` - maximal deepness for nested conditions
    of automatically generated queries.

* `rateLimits?: RateLimitOptions<any>` - rate limiting options.

* `rateLimitConstructor?: (options: RateLimitItemOptions) => any` - used to create a rate limiter instance.