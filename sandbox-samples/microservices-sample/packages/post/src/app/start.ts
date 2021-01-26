require("dotenv").config()
import { PostServer } from "./index"

PostServer.start()
  .then(() => {
    console.log(
      "Running at http://localhost:4002/graphql\r\nTry it in the http://localhost:4002/playground",
    )
  })
  .catch((error) => {
    console.error(error)
  })
