import { App, Category } from "microframework-template-monorepo-common"
import { CategoryRepository } from "../repository"

/**
 * Resolver for category declarations.
 */
export const CategoryDeclarationResolver = App.resolver({
  async category({ id }) {
    return await CategoryRepository.findOneBy({ id })
  },

  async categorySave(input): Promise<Category> {
    return CategoryRepository.save({
      id: input.id || undefined,
      name: input.name,
    })
  },

  async categoryRemove({ id }: { id: number }): Promise<boolean> {
    const category = await CategoryRepository.findOneBy({ id })
    if (!category) return false
    await CategoryRepository.remove(category)
    return true
  },
})
