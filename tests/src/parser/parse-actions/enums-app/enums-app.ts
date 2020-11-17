import { createApp } from "@microframework/core"

export const App = createApp<{
  actions: {
    /**
     * Loads a single category by its id.
     */
    "GET /api/category/:id": {
      params: {
        /**
         * Category id.
         */
        id: number
      }
      return: StatusEnum
    }

    /**
     * Saves a category.
     */
    "POST /api/category": {
      body: "new" | "old"
      return: StatusEnum
    }

    /**
     * Removes a category.
     */
    "DELETE /api/category/:id": {
      params: {
        /**
         * Category id.
         */
        id: number
      }
      return: {
        status: StatusEnum
      }
    }
  }
}>()

/**
 * Status.
 */
enum StatusEnum {
  /**
   * Indicates if operation was succeed.
   */
  success = "success",

  /**
   * Indicates if operation was failed.
   */
  fail = "fail",

  /**
   * Indicates if operation is pending.
   */
  pending = "pending",

  /**
   * Indicates if operation is is progress.
   *
   * @deprecated Use "pending" instead
   */
  isProgress = "isProgress",
}
