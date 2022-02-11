import { App, AppDataSource } from "../app"

/**
 * Used to perform User-entity database requests.
 */
export const UserRepository = AppDataSource.getRepository(App.model("User"))
