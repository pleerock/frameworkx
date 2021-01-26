/**
 * This input is used to filter loaded posts.
 */
export type PostFilterInput = {
  /**
   * Offset where from to start a posts loading.
   */
  skip: number

  /**
   * Maximal number of loaded posts.
   */
  take: number

  /**
   * Optional category id, to filter posts by.
   */
  categoryId?: number | null
}
