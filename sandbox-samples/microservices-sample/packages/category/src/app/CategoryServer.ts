import { createApplicationServer } from "@microframework/node"
import * as entities from "../entity"
import { CategoryApp } from "./CategoryApp"
import { CategoryDbConnection } from "./CategoryDbConnection"
import { CategoryContext } from "./CategoryContext"
import { CategoryPubSub } from "./CategoryPubSub"
import * as modelResolvers from "../model-resolver"
import * as rootResolvers from "../root-resolver"

/**
 * Application server setup.
 */
export const CategoryServer = createApplicationServer(CategoryApp, {
  appPath: __dirname + "/CategoryApp",
  webserver: {
    port: 4001,
    cors: true,
  },
  websocket: {
    host: "localhost",
    port: 5001,
    pubSub: CategoryPubSub,
  },
  graphql: {
    graphiql: true,
    playground: true,
  },
  resolvers: {
    ...modelResolvers,
    ...rootResolvers,
    CategoryContext: CategoryContext,
  },
  entities,
  dataSource: (options) => CategoryDbConnection.setOptions(options).connect(),
  // generateModelRootQueries: true,
})
