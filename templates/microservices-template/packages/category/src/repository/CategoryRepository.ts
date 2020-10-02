import { CategoryApp, CategoryDbConnection } from "../app"

/**
 * Used to perform Category-entity database queries.
 */
export const CategoryRepository = CategoryDbConnection.getRepository(
  CategoryApp.model("Category"),
)
