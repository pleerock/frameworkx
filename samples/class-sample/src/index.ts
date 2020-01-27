import { debugLogger } from "@microframework/logger"
import { defaultValidator } from "@microframework/validator"
import { App } from "./app/App"
import { AppConnection } from "./app/AppConnection"
import { AppServer } from "./app/AppServer"
import { Context } from "./app/Context"
import * as entities from "./entity"
import * as validators from "./validator"

App.setEntities(entities)
  // .setResolvers(resolvers)
  .setValidationRules(validators)
  .setDataSource(entities => AppConnection.setOptions({ entities }).connect())
  .setContext(Context)
  .setValidator(defaultValidator)
  .setLogger(debugLogger)
  .setGenerateModelRootQueries(true)
  .bootstrap(AppServer)
  .then(() => {
    console.log("Running a GraphQL API at http://localhost:3000/graphql")
  })
  .catch(error => {
    console.log("Error: ", error)
  })
