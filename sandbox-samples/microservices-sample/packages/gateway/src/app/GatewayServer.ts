import { createApplicationServer } from "@microframework/node"
import * as rootResolvers from "../root-resolver"
import * as modelResolvers from "../model-resolver"
import { GatewayApp } from "./GatewayApp"

/**
 * Application server setup.
 */
export const GatewayServer = createApplicationServer(GatewayApp, {
  appPath: __dirname + "/GatewayApp",
  webserver: {
    port: 4000,
    cors: true,
  },
  graphql: {
    graphiql: true,
    playground: true,
  },
  resolvers: {
    ...modelResolvers,
    ...rootResolvers,
  },
})
