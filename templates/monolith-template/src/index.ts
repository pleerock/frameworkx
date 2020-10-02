require("dotenv").config()
import { AppServer } from "./app/AppServer"

AppServer.start()
  .then(() => {
    console.log(
      "Running at http://localhost:4000/graphql\r\nTry it in the http://localhost:4000/playground",
    )
  })
  .catch((error) => {
    console.error(error)
  })
