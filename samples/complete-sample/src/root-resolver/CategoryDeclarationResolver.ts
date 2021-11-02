import { App } from "../app"
import { CategoryInput } from "../input"
import { Category } from "../model"
import { CategoryRepository } from "../repository"

/**
 * Resolver for category declarations.
 */
export const CategoryDeclarationResolver = App.resolver({
  async category(args) {
    return await CategoryRepository.findOne(args.id)
  },

  async categorySave(args): Promise<Category> {
    return await CategoryRepository.save({
      id: args.id || undefined,
      name: args.name,
    })
  },

  async categoryRemove(args): Promise<boolean> {
    const category = await CategoryRepository.findOneOrFail(args.id)
    await CategoryRepository.remove(category)
    return true
  },
})
