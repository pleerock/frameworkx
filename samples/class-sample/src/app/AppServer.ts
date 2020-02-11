import { createApplicationServer } from "@microframework/node"
import { App } from "./App"
import { AppConnection } from "./AppConnection"
import { AppContext } from "./AppContext"
import { AppPubSub } from "./AppPubSub"
import * as resolvers from "../resolver"
import * as entities from "../entity"
import * as validationRules from "../validator"

/**
 * Application server setup.
 */
export const AppServer = createApplicationServer(App, {
  appPath: __dirname + "/App",
  webserver: {
    port: 3000,
    cors: true,
  },
  websocket: {
    port: 3001,
    pubSub: AppPubSub,
  },
  graphql: {
    graphiql: true,
    playground: true,
  },
  resolvers: { ...resolvers, AppContext },
  entities,
  validationRules,
  dataSourceFactory: options => AppConnection.setOptions(options).connect(),
  generateModelRootQueries: true,
})
