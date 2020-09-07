import { ModelWithArgs } from "@microframework/core"
import { PostStatus } from "../enum"
import { Category } from "./Category"
import { User } from "./User"

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
   * Indicates if post is moderated or not.
   */
  status: PostStatus

  /**
   * Post categories.
   */
  categories: Category[]

  /**
   * Post creator.
   */
  author: User
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

/**
 * Model for Post, used to apply args.
 */
export type PostModel = ModelWithArgs<Post, PostArgs>
