import { createApp } from "@microframework/core"

export const App = createApp<{
  models: {
    PostType: PostType
    QuestionType: {
      id: number
      // status: StatusEnum & BanStatusEnum // TODO
      category: QuestionCategoryEnum
      type: "common" | "bounced"
    }
  }
}>()

/**
 * This is StatusEnum.
 */
enum StatusEnum {
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

/**
 * This is PostCategoryEnum.
 */
type PostCategoryEnum = "animals" | "cars"

type QuestionCategoryEnum = "medicine" | "programming"

enum BanStatusEnum {
  /**
   * Post is banned.
   */
  banned = "banned",
}

/**
 * Type for a PostType.
 */
type PostType = {
  id: number
  name: string
  status: StatusEnum
  category: PostCategoryEnum
  type: "blog" | "news"
}
