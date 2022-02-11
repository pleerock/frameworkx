require("dotenv").config()

import { App, AppDataSource } from "./app"
import { AppServer } from "./app/AppServer"

AppServer.start()
  .then(async () => {
    await AppDataSource.connect()
    console.log("Running a GraphQL API at http://localhost:3000/graphql")
  })
  .catch((error) => {
    console.error(error)
  })
