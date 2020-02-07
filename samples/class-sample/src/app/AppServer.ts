import { defaultServer } from "@microframework/node"
import { App } from "./App"
import { AppPubSub } from "./AppPubSub"

export const AppServer = defaultServer(App, {
  appPath: __dirname + "/App",
  port: 3000,
  websocketPort: 3001,
  cors: true,
  graphiql: true,
  playground: true,
  pubSub: AppPubSub,
  resolvers: [] // todo
})
