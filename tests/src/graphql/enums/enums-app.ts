import { createApp } from "@microframework/core"

export const App = createApp<{
  models: {
    PostType: PostType
    QuestionType: {
      id: number
      status: StatusEnum | BanStatusEnum
      category: QuestionCategoryEnum
      type: "common" | "bounced"
    }
  }
  inputs: {
    PostInput: PostInput
    QuestionInput: {
      id: number
      status: StatusEnum | BanStatusEnum
      category: QuestionCategoryEnum
      type: "common" | "bounced"
    }
  }
  queries: {
    post(input: PostInput): PostType
    postStatus(input: { status: StatusEnum }): StatusEnum
    question(): {
      id: number
      status: StatusEnum | BanStatusEnum
      category: QuestionCategoryEnum
      type: "common" | "bounced"
    }
  }
  mutations: {
    postSave(args: PostInput): PostType
    postsSave(args: { status: StatusEnum }): StatusEnum
    questionSave(args: {
      id: number
      status: StatusEnum | BanStatusEnum
      category: QuestionCategoryEnum
      type: "common" | "bounced"
    }): {
      id: number
      status: StatusEnum | BanStatusEnum
      category: QuestionCategoryEnum
      type: "common" | "bounced"
    }
  }
  subscriptions: {
    onPostSave(args: PostInput): PostType
    onPostsSave(args: { status: StatusEnum }): StatusEnum
    onQuestionSave(args: {
      id: number
      status: StatusEnum | BanStatusEnum
      category: QuestionCategoryEnum
      type: "common" | "bounced"
    }): {
      id: number
      status: StatusEnum | BanStatusEnum
      category: QuestionCategoryEnum
      type: "common" | "bounced"
    }
  }
  actions: {}
  context: {}
}>()

/**
 * This is StatusEnum.
 */
enum StatusEnum {
  /**
   * Is on draft.
   */
  draft = "draft",

  /**
   * Is published.
   */
  published = "published",

  /**
   * Is removed.
   * @deprecated
   */
  removed = "removed",

  /**
   * Is watched.
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
  /**
   * Post is temporary blocked.
   */
  temporaryBlocked = "temporaryBlocked",
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

/**
 * Type for a PostInput.
 */
type PostInput = {
  id: number
  name: string
  status: StatusEnum
  category: PostCategoryEnum
  type: "blog" | "news"
}
