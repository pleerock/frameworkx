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
      return: {
        /**
         * Category id.
         */
        id: number

        /**
         * Category name.
         */
        name: string | null

        /**
         * Category posts.
         * @deprecated
         */
        posts:
          | {
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
              status: "moderated" | "under_moderation"
            }[]
          | undefined
      }
    }

    /**
     * Saves a category.
     */
    "POST /api/category": {
      body: {
        /**
         * Category id.
         */
        id?: number | null

        /**
         * Category name.
         */
        name: string | undefined
      }
      return: {
        /**
         * Unique post id.
         */
        id: number

        /**
         * Post title.
         */
        title: string
      }
    }
  }
  models: {}
  inputs: {}
  queries: {}
  mutations: {}
  subscriptions: {}
  context: {}
}>()
