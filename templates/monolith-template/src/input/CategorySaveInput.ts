/**
 * This input is used to create a new category or change exist one.
 */
export type CategorySaveInput = {
  /**
   * Category id.
   * If id isn't specified, it means this input tries to create a new category.
   */
  id?: number | null

  /**
   * Category name.
   */
  name: string
}
