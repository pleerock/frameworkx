import { CategoryApp, CategoryDataSource } from "../app"

/**
 * Used to perform Category-entity database queries.
 */
export const CategoryRepository = CategoryDataSource.getRepository(
  CategoryApp.model("Category"),
)
