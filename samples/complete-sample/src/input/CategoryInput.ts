/**
 * This input is used to create new category or change exist one.
 */
export type CategoryInput = {
  /**
   * Category id.
   */
  id?: number | null

  /**
   * Category name.
   */
  name: string
}
