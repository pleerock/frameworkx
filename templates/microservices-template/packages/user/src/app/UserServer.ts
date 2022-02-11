import { createApplicationServer } from "@microframework/node"
import * as entities from "../entity"
import { UserApp } from "./UserApp"
import { UserDataSource } from "./UserDataSource"
import { UserContext } from "./UserContext"
import { UserPubSub } from "./UserPubSub"
import * as modelResolvers from "../model-resolver"
import * as rootResolvers from "../root-resolver"

/**
 * Application server setup.
 */
export const UserServer = createApplicationServer(UserApp, {
  appPath: __dirname + "/UserApp",
  webserver: {
    port: 4003,
    cors: true,
  },
  websocket: {
    host: "localhost",
    port: 5003,
    pubSub: UserPubSub,
  },
  graphql: {
    graphiql: true,
    playground: true,
  },
  resolvers: {
    ...modelResolvers,
    ...rootResolvers,
    UserContext: UserContext,
  },
  dataSource: () => UserDataSource.connect(),
  // generateModelRootQueries: true,
})
