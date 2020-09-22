import { createApplicationServer } from "@microframework/node"
import * as entities from "../entity"
import * as resolvers from "../resolver"
import * as validationRules from "../validator"
import { App } from "./App"
import { AppConnection } from "./AppConnection"
import { AppContext } from "./AppContext"
import { AppPubSub } from "./AppPubSub"

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
    port: 4001,
    pubSub: AppPubSub,
  },
  graphql: {
    graphiql: true,
    playground: true,
  },
  resolvers: { ...resolvers, AppContext },
  entities,
  validationRules,
  dataSource: (options) => AppConnection.setOptions(options).connect(),
  // generateModelRootQueries: true,
})
