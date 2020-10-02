import { App } from "microframework-template-monorepo-common"
import { AppConnection } from "../app"

/**
 * Used to perform Category-entity database queries.
 */
export const CategoryRepository = AppConnection.getRepository(
  App.model("Category"),
)
