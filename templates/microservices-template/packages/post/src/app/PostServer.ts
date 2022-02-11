import { createApplicationServer } from "@microframework/node"
import * as modelResolvers from "../model-resolver"
import * as rootResolvers from "../root-resolver"
import * as validationRules from "../validator"
import { PostApp } from "./PostApp"
import { PostContext } from "./PostContext"
import { PostPubSub } from "./PostPubSub"
import { PostDataSource } from "./PostDataSource"

/**
 * Application server setup.
 */
export const PostServer = createApplicationServer(PostApp, {
  appPath: __dirname + "/PostApp",
  webserver: {
    port: 4002,
    cors: true,
  },
  websocket: {
    host: "localhost",
    port: 5002,
    pubSub: PostPubSub,
  },
  graphql: {
    graphiql: true,
    playground: true,
  },
  resolvers: {
    ...modelResolvers,
    ...rootResolvers,
    PostContext: PostContext,
  },
  validationRules,
  dataSource: () => PostDataSource.connect(),
  // generateModelRootQueries: true,
})
