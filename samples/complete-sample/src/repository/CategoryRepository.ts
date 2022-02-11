import { App, AppDataSource } from "../app"

/**
 * Used to perform Category-entity database requests.
 */
export const CategoryRepository = AppDataSource.getRepository(
  App.model("Category"),
)
