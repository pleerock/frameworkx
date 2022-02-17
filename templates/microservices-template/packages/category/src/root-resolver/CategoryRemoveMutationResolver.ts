import { CategoryApp } from "../app"
import { CategoryRepository } from "../repository"

/**
 * Resolver for "categoryRemove" mutation.
 */
export const CategoryRemoveMutationResolver = CategoryApp.resolver(
  "categoryRemove",
  async ({ id }: { id: number }) => {
    const category = await CategoryRepository.findOneBy({ id })
    if (!category) return false
    await CategoryRepository.remove(category)
    return true
  },
)
