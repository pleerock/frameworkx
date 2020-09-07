import { AppConnection } from "../app/AppConnection"
import { App } from "../app/App"

/**
 * Used to perform User-entity database requests.
 */
export const UserRepository = AppConnection.getRepository(App.model("User"))
