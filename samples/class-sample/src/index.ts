import { defaultServer } from "@microframework/node"
import { debugLogger } from "@microframework/logger"
import { defaultValidator } from "@microframework/validator"
import { createConnection } from "typeorm"
import { App } from "./App"
import { Context } from "./Context"
import { PubSub } from "graphql-subscriptions"

import * as resolvers from "./resolver"
import * as entities from "./entity"
import * as validators from "./validator"

export const PubSubImpl = new PubSub()

App.setEntities(entities)
  // .setResolvers(resolvers)
  .setValidationRules(validators)
  .setDataSource(entities => {
    return createConnection({
      type: "sqlite",
      database: __dirname + "/../database.sqlite",
      entities: entities,
      synchronize: true,
      logging: false,
    })
  })
  .setContext(Context)
  .setValidator(defaultValidator)
  .setLogger(debugLogger)
  .setGenerateModelRootQueries(true)
  .bootstrap(
    defaultServer(App, {
      appPath: __dirname + "/app",
      port: 3000,
      websocketPort: 3001,
      cors: true,
      graphiql: true,
      playground: true,
      pubSub: PubSubImpl,
    }),
  )
  .then(() => {
    console.log("Running a GraphQL API at http://localhost:3000/graphql")
  })
  .catch(error => {
    console.log("Error: ", error)
  })
