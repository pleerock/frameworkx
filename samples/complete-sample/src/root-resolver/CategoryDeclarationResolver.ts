import { App } from "../app"
import { CategoryInput } from "../input"
import { Category } from "../model"
import { CategoryRepository } from "../repository"

/**
 * Resolver for category declarations.
 */
export const CategoryDeclarationResolver = App.resolver({
  async category({ id }) {
    return await CategoryRepository.findOneBy({ id })
  },

  async categorySave(args): Promise<Category> {
    return await CategoryRepository.save({
      id: args.id || undefined,
      name: args.name,
    })
  },

  async categoryRemove({ id }): Promise<boolean> {
    const category = await CategoryRepository.findOneByOrFail({ id })
    await CategoryRepository.remove(category)
    return true
  },
})
