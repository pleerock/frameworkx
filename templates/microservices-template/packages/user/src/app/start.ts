require("dotenv").config()
import { UserServer } from "./index"

UserServer.start()
  .then(() => {
    console.log(
      "Running at http://localhost:4003/graphql\r\nTry it in the http://localhost:4003/playground",
    )
  })
  .catch((error) => {
    console.error(error)
  })
