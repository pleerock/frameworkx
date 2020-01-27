import { Model } from "@microframework/core"
import { PostStatus } from "../enum/PostStatus"
import { CategoryType } from "./Category"
import { UserType } from "./User"

/**
 * Simple model for testing purposes.
 */
export type PostModel = Model<PostType, PostArgs>

/**
 * Type for a PostModel.
 */
export interface PostType {
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
  status: PostStatus

  /**
   * Post categories.
   */
  categories: CategoryType[]

  /**
   * Post creator.
   */
  author: UserType
}

/**
 * Args for a PostModel.
 */
export type PostArgs = {
  title: {
    /**
     * Keyword to search name by.
     */
    keyword: string | null
  }
}
