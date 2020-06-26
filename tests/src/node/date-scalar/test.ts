import { TestFetcher } from "../../util/test-fetcher"
import { AppServer } from "./server"

const server = AppServer(9999).start()
console.log("Server is running")
