import { AppResolverType, ListOfType } from "@microframework/core"
import { createApplicationServer } from "@microframework/node"
import { App } from "./app"

export const AppServer = (
  port: number,
  resolvers: ListOfType<AppResolverType>,
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
