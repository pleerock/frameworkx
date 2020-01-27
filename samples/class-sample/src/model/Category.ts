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
  name: string

  /**
   * All posts attached to this category.
   */
  posts: Post[]
}
