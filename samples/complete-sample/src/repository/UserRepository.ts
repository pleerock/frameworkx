import * as typeorm from "typeorm"
import { AppConnection } from "../app/AppConnection"
import { AppModels } from "../app/AppModels"

/**
 * Used to perform User-entity database requests.
 */
export const UserRepository = AppConnection.getRepository(AppModels.User)
