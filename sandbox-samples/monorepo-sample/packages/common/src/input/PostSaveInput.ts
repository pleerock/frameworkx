/**
 * This input is used to create a new post or update exist post.
 */
export type PostSaveInput = {
  /**
   * Updating post id.
   * If id isn't specified, it means this input tries to create a new post.
   */
  id?: number | null

  /**
   * Post title.
   */
  title: string

  /**
   * Post text.
   */
  text?: string | null

  /**
   * Categories to attach to this post.
   */
  categoryIds?: number[] | null
}
