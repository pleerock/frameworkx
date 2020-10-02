import { createApplicationServer } from "@microframework/node"
import * as entities from "../entity"
import * as validationRules from "../validator"
import * as modelResolvers from "../model-resolver"
import * as rootResolvers from "../root-resolver"
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
    port: 3000,
    cors: true,
  },
  websocket: {
    host: "localhost",
    port: 3001,
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
  entities,
  validationRules,
  dataSource: (options) => AppConnection.setOptions(options).connect(),
  generateModelRootQueries: true,
})
