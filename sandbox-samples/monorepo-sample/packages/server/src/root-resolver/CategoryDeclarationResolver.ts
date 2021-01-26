import { App, Category } from "@monorepo-test/common"
import { CategoryRepository } from "../repository"

/**
 * Resolver for category declarations.
 */
export const CategoryDeclarationResolver = App.resolver({
  async category(input) {
    return await CategoryRepository.findOne(input.id)
  },

  async categorySave(input): Promise<Category> {
    return CategoryRepository.save({
      id: input.id || undefined,
      name: input.name,
    })
  },

  async categoryRemove(input: { id: number }): Promise<boolean> {
    const category = await CategoryRepository.findOne(input.id)
    if (!category) return false
    await CategoryRepository.remove(category)
    return true
  },
})
