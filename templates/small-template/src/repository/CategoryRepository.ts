import { AppConnection } from "../app/AppConnection"
import { App } from "../app/App"

/**
 * Used to perform Category-entity database queries.
 */
export const CategoryRepository = AppConnection.getRepository(
  App.model("Category"),
)
