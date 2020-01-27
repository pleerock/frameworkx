import { PostType } from "./Post"

/**
 * Dummy type.
 */
export type CategoryType = {
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
  posts: PostType[]
}
