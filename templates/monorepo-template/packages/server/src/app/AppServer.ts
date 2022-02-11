import { createApplicationServer } from "@microframework/node"
import * as rootResolvers from "../root-resolver"
import * as modelResolvers from "../model-resolver"
import * as validationRules from "../validator"
import { App } from "microframework-template-monorepo-common"
import { AppContext } from "./AppContext"
import { AppPubSub } from "./AppPubSub"
import { AppDataSource } from "./AppDataSource"

/**
 * Application server setup.
 */
export const AppServer = createApplicationServer(App, {
  // NOTE: appPath might be different in production environment
  //       it's a good practice to use ENV va
  appPath:
    __dirname +
    "/../../node_modules/microframework-template-monorepo-common/_/app",
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
  generateModelRootQueries: true,
})
