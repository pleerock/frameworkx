import { contextResolver } from "@microframework/core"
import { createApplicationServer } from "@microframework/node"
import { RedisPubSub } from "graphql-redis-subscriptions"
import { App } from "./app"
import { PostResolver } from "./resolvers"

export const AppServer = (
  webserverPort: number,
  websocketPort: number,
  appPubSub: RedisPubSub,
) => {
  return createApplicationServer(App, {
    appPath: __dirname + "/app",
    webserver: {
      port: webserverPort,
      cors: true,
    },
    websocket: {
      host: "localhost",
      port: websocketPort,
      pubSub: appPubSub,
      // websocketServer: jest.requireActual("ws").Server,
    },
    graphql: {
      graphiql: true,
      playground: true,
    },
    resolvers: [
      PostResolver,
      contextResolver(App, {
        appPubSub: () => appPubSub,
      }),
    ],
  })
}
