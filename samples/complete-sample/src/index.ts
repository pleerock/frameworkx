require("dotenv").config()

import { AppServer } from "./app/AppServer"

AppServer.start()
  .then(async () => {
    console.log("Running a GraphQL API at http://localhost:3000/graphql")
  })
  .catch((error) => {
    console.error(error)
  })
