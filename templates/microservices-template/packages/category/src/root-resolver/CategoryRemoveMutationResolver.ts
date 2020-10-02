import { CategoryApp } from "../app"
import { CategoryRepository } from "../repository"

/**
 * Resolver for "categoryRemove" mutation.
 */
export const CategoryRemoveMutationResolver = CategoryApp.resolver(
  "categoryRemove",
  async (input: { id: number }) => {
    const category = await CategoryRepository.findOne(input.id)
    if (!category) return false
    await CategoryRepository.remove(category)
    return true
  },
)
