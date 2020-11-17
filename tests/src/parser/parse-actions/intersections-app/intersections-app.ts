import { createApp } from "@microframework/core"

export const App = createApp<{
  actions: {
    /**
     * Loads a single category by its id.
     */
    "GET /api/category/:id": {
      params: {
        /**
         * Category id.
         */
        id: number
      }
      return: Category & CategoryExtras
    }

    /**
     * Loads a single category and a single post by their ids.
     */
    "GET /api/category-post/:id": {
      params: {
        /**
         * Category id.
         */
        args: {
          postId: number
          categoryId: number
        }
      }
      return: {
        category: {
          /**
           * Category id.
           */
          id: number

          /**
           * Category name.
           */
          name: string | null
        } & {
          /**
           * Category posts.
           * @deprecated
           */
          posts: (Post & PostExtras)[] | undefined
        }
        post: {
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
           * Indicates if post is moderated or not.
           */
          status: PostStatus
        } & {
          /**
           * Indicates if post is watched.
           */
          watched: boolean

          /**
           * Post watches count.
           */
          watchesCount: number
        }
      }
    }

    /**
     * Saves a category.
     */
    "POST /api/category": {
      body: CategoryInput & CategoryInputExtras
      return: Category & CategoryExtras
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
}

class CategoryExtras {
  /**
   * Category posts.
   * @deprecated
   */
  posts: (Post & PostExtras)[] | undefined
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
 * This input is used to create new category or change exist one.
 */
type CategoryInputExtras = {
  /**
   * Indicates if category is active.
   */
  active: boolean | undefined
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
   * Indicates if post is moderated or not.
   */
  status: PostStatus
}

class PostExtras {
  /**
   * Indicates if post is watched.
   */
  watched!: boolean

  /**
   * Post watches count.
   */
  watchesCount!: number
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
