import { App, AppConnection } from "../app"

/**
 * Used to perform User-entity database requests.
 */
export const UserRepository = AppConnection.getRepository(App.model("User"))
