import { Post } from "./Post"

/**
 * Posts are grouped by categories.
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
   * All posts inside the category.
   */
  posts: Post[]
}
