import { createApp } from "@microframework/core"

export const App = createApp<{
  models: {
    PostType: {
      id: number
      name: string
      status: PostStatusType
    }
    PostStatusType: PostStatusType
  }
}>()

/**
 * Type for a PostStatus.
 */
enum PostStatusType {
  /**
   * Post is on draft.
   */
  draft = "draft",

  /**
   * Post is published.
   */
  published = "published",

  /**
   * Post is removed.
   * @deprecated
   */
  removed = "removed",

  /**
   * Post is watched.
   * @deprecated this status is not used anymore.
   */
  watched = "watched",
}
