import { DeclarationResolver } from "@microframework/core"
import { CategoryDeclaration } from "../declaration/CategoryDeclaration"
import { CategoryInput } from "../input/CategoryInput"
import { CategoryType } from "../model/Category"
import { CategoryRepository } from "../repository/CategoryRepository"

export class CategoryDeclarationResolver
  implements DeclarationResolver<CategoryDeclaration> {
  async category(args: { id: number }): Promise<CategoryType> {
    return CategoryRepository.findOneOrFail(args.id)
  }

  async categorySave(args: CategoryInput): Promise<CategoryType> {
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
