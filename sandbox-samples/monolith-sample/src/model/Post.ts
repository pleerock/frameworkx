import { Category } from "./Category"

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
   * Post categories.
   */
  categories: Category[]
}
