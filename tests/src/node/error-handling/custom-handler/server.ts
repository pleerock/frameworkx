import { createApplicationServer } from "@microframework/node"
import { App } from "./app"
import { CustomErrorHandler } from "./custom-error-handler"
import { PostResolver, PostsActionResolver } from "./resolvers"

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
    resolvers: [PostResolver, PostsActionResolver],
    errorHandler: CustomErrorHandler,
  })
}
