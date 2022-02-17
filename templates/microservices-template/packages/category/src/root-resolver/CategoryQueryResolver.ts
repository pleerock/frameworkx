import { CategoryApp } from "../app"
import { CategoryRepository } from "../repository"

/**
 * Resolver for "category" query.
 */
export const CategoryQueryResolver = CategoryApp.resolver(
  "category",
  async ({ id }) => {
    return await CategoryRepository.findOneBy({ id })
  },
)
