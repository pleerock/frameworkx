import { createApplicationServer } from "@microframework/node"
import { App } from "./app"
import { PostCreateResolver, PostResolver } from "./resolvers"

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
    resolvers: [PostResolver, PostCreateResolver],
  })
}
