import { DeclarationResolver } from "@microframework/core"
import { CategoryDeclaration } from "../declaration/CategoryDeclaration"
import { CategoryInput } from "../input/CategoryInput"
import { Category } from "../model/Category"
import { CategoryRepository } from "../repository/CategoryRepository"

export class CategoryDeclarationResolver
  implements DeclarationResolver<CategoryDeclaration> {
  async category(args: { id: number }): Promise<Category> {
    return CategoryRepository.findOneOrFail(args.id)
  }

  async categorySave(args: CategoryInput): Promise<Category> {
    return await CategoryRepository.save({
      id: args.id,
      name: args.name,
    })
  }

  async categoryRemove(args: { id: number }): Promise<boolean> {
    const category = await CategoryRepository.findOneOrFail(args.id)
    await CategoryRepository.remove(category)
    return true
  }
}
