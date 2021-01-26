import { CategoryApp } from "../app"
import { CategoryRepository } from "../repository"

/**
 * Resolver for "categorySave" mutation.
 */
export const CategorySaveMutationResolver = CategoryApp.resolver(
  "categorySave",
  async (input) => {
    return CategoryRepository.save({
      id: input.id || undefined,
      name: input.name,
    })
  },
)
