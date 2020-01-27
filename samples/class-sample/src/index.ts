import { debugLogger } from "@microframework/logger"
import { defaultServer } from "@microframework/node"
import { defaultValidator } from "@microframework/validator"
import { PubSub } from "graphql-subscriptions"
import { App } from "./App"
import { AppConnection } from "./AppConnection"
import { Context } from "./Context"
import * as entities from "./entity"
import * as validators from "./validator"

export const PubSubImpl = new PubSub()

App.setEntities(entities)
  // .setResolvers(resolvers)
  .setValidationRules(validators)
  .setDataSource(entities => {
    return AppConnection.setOptions({ entities }).connect()
  })
  .setContext(Context)
  .setValidator(defaultValidator)
  .setLogger(debugLogger)
  .setGenerateModelRootQueries(true)
  .bootstrap(
    defaultServer(App, {
      appPath: __dirname + "/App",
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
