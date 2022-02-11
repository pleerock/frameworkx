import { App } from "microframework-template-monorepo-common"
import { AppDataSource } from "../app"

/**
 * Used to perform Category-entity database queries.
 */
export const CategoryRepository = AppDataSource.getRepository(
  App.model("Category"),
)
