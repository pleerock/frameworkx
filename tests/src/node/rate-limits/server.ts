import { createApplicationServer, RateLimitOptions } from "@microframework/node"
import { RateLimiterRedis } from "rate-limiter-flexible";
import { App } from "./app"
import { PostActionResolver, PostResolver, PostSaveResolver, PostTypeResolver } from "./resolvers";

const Redis = require('ioredis');

export const AppServer = (port: number, rateLimits: RateLimitOptions<typeof App>) => {
    const redisClient = new Redis({ enableOfflineQueue: true });
    const server = createApplicationServer(App, {
        appPath: __dirname + "/app",
        webserver: {
            port: port,
            cors: true,
        },
        graphql: {
            graphiql: true,
            playground: true,
        },
        resolvers: [
            PostResolver,
            PostSaveResolver,
            PostActionResolver,
            PostTypeResolver,
        ],
        rateLimitConstructor: options => {
            return new RateLimiterRedis({
                storeClient: redisClient,
                ...options
            });
        },
        rateLimits
    })
    const originalStop = server.stop.bind(server)
    server.stop = async () => {
        await redisClient.disconnect()
        return originalStop()
    }
    return server
}
