import { createApp } from "@microframework/core"
import { PostInput } from "../../node/types/basic-types/models"

export const App = createApp<{
  models: {
    Category: Category
    Post: Post
  }
  inputs: {
    CategoryInput: CategoryInput
    PostInput: PostInput
  }
  actions: {
    /**
     * Loads a single category by its id.
     */
    "GET /api/category/:id": {
      headers: {
        "X-Request-ID": string
      }
      cookies: {
        accessToken: string
      }
      params: {
        /**
         * Category id.
         */
        id: number
      }
      return: Category
    }

    /**
     * Saves a category or a post.
     */
    "POST /api/post-category": {
      body: CategoryInput | PostInput
      return: Category | Post
    }

    /**
     * Saves a category.
     */
    "POST /api/category": {
      body: CategoryInput
      return: Category
    }

    /**
     * Removes a category.
     */
    "DELETE /api/category/:id": {
      params: {
        /**
         * Category id.
         */
        id: number
      }
      return: {
        success: boolean
      }
    }

    /**
     * Deprecated, use delete by id instead.
     * @deprecated
     */
    "DELETE /api/categories": {
      return: {
        success: boolean
      }
    }

    /**
     * Saves a post.
     */
    "POST /api/post": {
      body: {
        id: string
        title: string
      }
      return: {
        id: string
        title: string
        status: PostStatus
        categories: Category[]
      }
    }
  }
}>()

class Category {
  /**
   * Category id.
   */
  id!: number

  /**
   * Category name.
   */
  name!: string | null

  /**
   * Category posts.
   * @deprecated
   */
  posts: Post[] | undefined
}

/**
 * This input is used to create new category or change exist one.
 */
type CategoryInput = {
  /**
   * Category id.
   */
  id?: number | null

  /**
   * Category name.
   */
  name: string | undefined
}

/**
 * Dummy type for Post.
 */
interface Post {
  /**
   * Unique post id.
   */
  id: number

  /**
   * Post title.
   */
  title: string

  /**
   * Post categories count.
   * @deprecated Will be removed.
   */
  categoryCount: number

  /**
   * Post categories.
   */
  categories: Category[]

  /**
   * Indicates if post is moderated or not.
   */
  status: PostStatus
}

/**
 * Post's publication status.
 */
enum PostStatus {
  /**
   * Indicates if post was moderated.
   */
  moderated = "moderated",

  /**
   * Indicates if post is under moderation.
   */
  under_moderation = "under_moderation",
}
