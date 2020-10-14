import { AppResolverType, MixedList } from "@microframework/core"
import { createApplicationServer } from "@microframework/node"
import { App } from "./app"

export const AppServer = (
  port: number,
  resolvers: MixedList<AppResolverType>,
) => {
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
    resolvers,
  })
}
