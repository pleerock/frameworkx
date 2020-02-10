import { createApplicationServer } from "@microframework/node"
import { App } from "./App"
import { AppConnection } from "./AppConnection"
import { AppContext } from "./AppContext";
import { AppPubSub } from "./AppPubSub"
import * as resolvers from "../resolver"
import * as entities from "../entity"
import * as validationRules from "../validator"

export const AppServer = createApplicationServer(App, {
  appPath: __dirname + "/App",
  port: 3000,
  websocket: {
    port: 3001,
    pubSub: AppPubSub,
  },
  graphql: {
    graphiql: true,
    playground: true,
  },
  cors: true,
  resolvers: { ...resolvers, AppContext },
  entities,
  validationRules,
  dataSourceFactory: options => AppConnection.setOptions(options).connect(),
  generateModelRootQueries: true,
})
