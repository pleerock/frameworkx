import { CategoryInput } from "../input/CategoryInput"
import { CategoryType } from "../model/Category"

/**
 * Declarations for Category.
 */
export type CategoryDeclaration = {
  models: {
    CategoryType: CategoryType
  }

  inputs: {
    CategoryInput: CategoryInput
  }

  queries: {
    /**
     * Loads a single category by its id.
     */
    category(args: { id: number }): CategoryType
  }

  mutations: {
    /**
     * Saves a category.
     */
    categorySave(args: CategoryInput): CategoryType

    /**
     * Removes a category.
     */
    categoryRemove(args: { id: number }): boolean
  }
}
