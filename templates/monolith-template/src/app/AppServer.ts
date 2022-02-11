import { createApplicationServer } from "@microframework/node"
import * as validationRules from "../validator"
import * as modelResolvers from "../model-resolver"
import * as rootResolvers from "../root-resolver"
import { App } from "./App"
import { AppContext } from "./AppContext"
import { AppPubSub } from "./AppPubSub"
import { AppDataSource } from "./AppDataSource"

/**
 * Application server setup.
 */
export const AppServer = createApplicationServer(App, {
  appPath: __dirname + "/App",
  webserver: {
    port: 4000,
    cors: true,
  },
  websocket: {
    host: "localhost",
    port: 5000,
    pubSub: AppPubSub,
  },
  graphql: {
    graphiql: true,
    playground: true,
  },
  resolvers: {
    ...modelResolvers,
    ...rootResolvers,
    AppContext: AppContext,
  },
  validationRules,
  dataSource: () => AppDataSource.connect(),
  // generateModelRootQueries: true,
})
