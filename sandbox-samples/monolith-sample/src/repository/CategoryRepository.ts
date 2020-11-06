import { App, AppConnection } from "../app"

/**
 * Used to perform Category-entity database queries.
 */
export const CategoryRepository = AppConnection.getRepository(
  App.model("Category"),
)
