import { createApp } from "@microframework/core"
import { Category } from "../model"
import { CategorySaveInput } from "../input"

/**
 * Main application declarations file.
 */
export const CategoryApp = createApp<{
  models: {
    Category: Category
  }
  inputs: {
    CategorySaveInput: CategorySaveInput
  }

  queries: {
    /**
     * Loads a single category by its id.
     * Returns null if category was not found.
     */
    category(input: { id: number }): Category | null
  }

  mutations: {
    /**
     * Saves a category.
     *
     * If category id is given, it tries to update exist category.
     * If category id is not given, it will create a new category.
     */
    categorySave(input: CategorySaveInput): Category

    /**
     * Removes a category.
     * Returns false if category with a given id was not found.
     */
    categoryRemove(input: { id: number }): boolean
  }
}>()
