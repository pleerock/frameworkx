import { debugLogger } from "@microframework/logger"
import { defaultServer } from "@microframework/node"
import { defaultValidator } from "@microframework/validator"
import { App } from "./app/App"
import { AppConnection } from "./app/AppConnection"
import { AppContext } from "./app/AppContext"
import { AppPubSub } from "./app/AppPubSub"
import { AppServer } from "./app/AppServer"
import * as resolvers from "./resolver"
import * as entities from "./entity"
import * as validators from "./validator"

// todo: .setValidationRules(validators)
// todo: rename setLogger to useLogger?
// todo: rename setValidator to useValidator?
// todo: add declaration-specific logger into default context

App.setValidator(defaultValidator)
App.setLogger(debugLogger)
App.bootstrap(defaultServer(App, {
    appPath: __dirname + "/app/App",
    port: 3000,
    websocketPort: 3001,
    cors: true,
    graphiql: true,
    playground: true,
    pubSub: AppPubSub,
    // entities,
    resolvers, // [AppContext]
    generateModelRootQueries: true,
    dataSourceFactory: options => AppConnection.setOptions(options).connect(),
}))
    .then(() => {
        console.log("Running a GraphQL API at http://localhost:3000/graphql")
    })
    .catch(error => {
        console.log("Error: ", error)
    })

// App.setEntities(entities)
//   .setResolvers(resolvers)
//   .addResolvers([AppContext])
//   .setValidationRules(validators)
//   .setDataSource(entities => AppConnection.setOptions({ entities }).connect())
//   .setValidator(defaultValidator)
//   .setLogger(debugLogger)
//   .setGenerateModelRootQueries(true)
//   .bootstrap(AppServer)
