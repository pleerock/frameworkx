import { Category } from "./Category"

/**
 * Dummy type for Post.
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
   * Post categories.
   */
  categories: Category[]
}
