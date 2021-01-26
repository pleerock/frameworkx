import { createApplicationServer } from "@microframework/node"
import * as entities from "../entity"
import * as rootResolvers from "../root-resolver"
import * as modelResolvers from "../model-resolver"
import * as validationRules from "../validator"
import { App } from "@monorepo-test/common"
import { AppConnection } from "./AppConnection"
import { AppContext } from "./AppContext"
import { AppPubSub } from "./AppPubSub"

/**
 * Application server setup.
 */
export const AppServer = createApplicationServer(App, {
  // NOTE: appPath might be different in production environment
  //       it's a good practice to use ENV va
  appPath:
    __dirname +
    "/../../node_modules/@monorepo-test/common/_/app",
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
  entities,
  validationRules,
  dataSource: (options) => AppConnection.setOptions(options).connect(),
  generateModelRootQueries: true,
})
