import { createApplicationServer } from "@microframework/node"
import { App } from "./app"
import {
  PostResolver,
  PostsActionResolver,
  PostSaveResolver,
  PostsNewActionResolver,
  PostsOldActionResolver,
  PostTypeResolver,
} from "./resolvers"

export const AppServer = (port: number) => {
  return createApplicationServer(App, {
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
      PostsActionResolver,
      PostsNewActionResolver,
      PostsOldActionResolver,
      PostTypeResolver,
    ],
  })
}
