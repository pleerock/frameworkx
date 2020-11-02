import { CategoryApp } from "../app"
import { CategoryRepository } from "../repository"

/**
 * Resolver for "category" query.
 */
export const CategoryQueryResolver = CategoryApp.resolver(
  "category",
  async (input) => {
    return await CategoryRepository.findOne(input.id)
  },
)
