import { createApplicationServer } from "@microframework/node"
import { PostApp } from "./app"
import { PostsResolver } from "./resolver/PostsResolver"
import { PostResolver } from "./resolver/PostResolver"
import { PostSaveResolver } from "./resolver/PostSaveResolver"
import { PostRemoveResolver } from "./resolver/PostRemoveResolver"

/**
 * Application server setup.
 */
export const PostServer = createApplicationServer(PostApp, {
  appPath: __dirname + "/app",
  webserver: {
    port: 4000,
    cors: true,
  },
  graphql: {
    graphiql: true,
    playground: true,
  },
  resolvers: [
    PostsResolver,
    PostResolver,
    PostSaveResolver,
    PostRemoveResolver,
  ],
})
