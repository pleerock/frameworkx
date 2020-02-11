import { CategoryInput } from "../input"
import { Category } from "../model"

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
    category(args: { id: number }): Category | null
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
