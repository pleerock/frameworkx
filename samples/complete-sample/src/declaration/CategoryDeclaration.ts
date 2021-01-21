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

  actions: {
    /**
     * Loads a single category by its id.
     */
    "GET /api/category/:id": {
      headers: {
        "X-Request-ID": string
      }
      cookies: {
        accessToken: string
      }
      params: {
        /**
         * Category id.
         */
        id: number
      }
      return: Category
    }

    /**
     * Saves a category.
     */
    "POST /api/category": {
      body: CategoryInput
      return: Category
    }

    /**
     * Removes a category by id.
     */
    "DELETE /api/category/:id": {
      params: {
        /**
         * Category id.
         */
        id: number
      }
      return: {
        success: boolean
      }
    }

    /**
     * Deprecated, use delete by id instead.
     * @deprecated
     */
    "DELETE /api/categories": {
      return: {
        success: boolean
      }
    }
  }
}
