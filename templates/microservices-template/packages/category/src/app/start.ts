require("dotenv").config()
import { CategoryServer } from "./index"

CategoryServer.start()
  .then(() => {
    console.log(
      "Running at http://localhost:4001/graphql\r\nTry it in the http://localhost:4001/playground",
    )
  })
  .catch((error) => {
    console.error(error)
  })
