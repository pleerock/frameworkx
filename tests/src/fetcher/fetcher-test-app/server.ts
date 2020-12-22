import { contextResolver } from "@microframework/core"
import { createApplicationServer } from "@microframework/node"
import { RedisPubSub } from "graphql-redis-subscriptions"
import { App } from "./app"
import { PostResolver } from "./resolvers"

const Redis = require("ioredis")

export const AppServer = (webserverPort: number, websocketPort: number) => {
  const redisOptions = {
    host: "localhost",
    port: 6379,
    retryStrategy: (times: number) => {
      // reconnect after
      return Math.min(times * 50, 2000)
    },
    enableOfflineQueue: true,
  }
  const redisClientPub = new Redis(redisOptions)
  const redisClientSub = new Redis(redisOptions)
  const appPubSub = new RedisPubSub({
    publisher: redisClientPub,
    subscriber: redisClientSub,
  })
  const server = createApplicationServer(App, {
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
  const originalStop = server.stop.bind(server)
  server.stop = async () => {
    if (redisClientPub.status !== "end") await redisClientPub.disconnect()
    if (redisClientSub.status !== "end") await redisClientSub.disconnect()
    await appPubSub.close()
    return originalStop()
  }
  return server
}
