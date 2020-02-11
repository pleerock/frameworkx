import { Post } from "./Post"

/**
 * Dummy Category Type.
 */
export type Category = {
  /**
   * Category id.
   */
  id: number

  /**
   * Category name.
   */
  name: string | null

  /**
   * All posts attached to this category.
   */
  posts: Post[]

  /**
   * Number of posts in the category.
   */
  postsCount: number

}
