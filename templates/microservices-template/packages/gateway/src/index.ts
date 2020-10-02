require("dotenv").config()
globalThis.fetch = require("node-fetch")
import { GatewayServer } from "./app"

GatewayServer.start()
  .then(() => {
    console.log(
      "Running at http://localhost:4000/graphql\r\nTry it in the http://localhost:4000/playground",
    )
  })
  .catch((error) => {
    console.error(error)
  })
