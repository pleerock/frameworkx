import { CategoryApp } from "../app"
import { CategoryRepository } from "../repository"

/**
 * Resolver for "category" query.
 */
export const CategoryQueryResolver = CategoryApp.resolver(
  "category",
  async (input) => {
    const category = await CategoryRepository.findOne(input.id)
    return category ? category : null
  },
)
