import { App } from "../app/App"
import { Category } from "../model"
import { CategoryRepository } from "../repository"

/**
 * Resolver for category declarations.
 */
export const CategoryDeclarationResolver = App.resolver({
  async category(input) {
    const category = await CategoryRepository.findOne(input.id)
    return category ? category : null
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
