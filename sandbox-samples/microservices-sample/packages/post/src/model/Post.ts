/**
 * Dummy website Post.
 */
export interface Post {
  /**
   * Unique post id.
   */
  id: number

  /**
   * Post title.
   */
  title: string

  /**
   * Post content. Can be empty.
   */
  text: string | null

  /**
   * Indicates if post is moderated or not.
   */
  status: "under_moderation" | "moderated"

  /**
   * Optional category, where this post is attached to.
   */
  categoryId?: number | null
}
