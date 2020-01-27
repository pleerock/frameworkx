import { CategoryInput } from "../input/CategoryInput"
import { Category } from "../model/Category"

/**
 * Declarations for Category.
 */
export type CategoryDeclaration = {
  models: {
    Category: Category
  }

  inputs: {
    CategoryInput: CategoryInput
  }

  queries: {
    /**
     * Loads a single category by its id.
     */
    category(args: { id: number }): Category
  }

  mutations: {
    /**
     * Saves a category.
     */
    categorySave(args: CategoryInput): Category

    /**
     * Removes a category.
     */
    categoryRemove(args: { id: number }): boolean
  }
}
