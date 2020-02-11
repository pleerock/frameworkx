import * as typeorm from "typeorm"
import { AppConnection } from "../app/AppConnection"
import { AppModels } from "../app/AppModels"

/**
 * Used to perform Category-entity database requests.
 */
export const CategoryRepository = AppConnection.getRepository(
  AppModels.Category,
)
