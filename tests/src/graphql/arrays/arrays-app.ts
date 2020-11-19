import { createApp } from "@microframework/core"

export const App = createApp<{
  models: {
    PostSimpleType: PostSimpleType[]
    PostType: PostType
    CategoryType: CategoryGeneralType[] & CategoryMetaType[]
    PostCategoryType: {
      post: PostType[]
      category: (CategoryGeneralType & CategoryMetaType)[]
    }
    QuestionType: QuestionType[] & { answers: string }[]
    AnswerType: ({ id: number } & { names: string[] })[]
  }
  inputs: {
    PostSimpleInput: PostSimpleInput[]
    PostInput: PostInput[]
    CategoryInput: CategoryGeneralType[] & CategoryMetaType[]
    PostCategoryInput: {
      post: PostInput[]
      category: (CategoryGeneralType & CategoryMetaType)[]
    }
    QuestionInput: QuestionInput[] & { answer: string }[]
    AnswerInput: ({ id: number } & { names: string[] })[]
  }
  queries: {
    postSimple(args: PostSimpleInput[]): PostSimpleType[]
    post(args: PostInput[]): PostType[]
    posts(args: { posts: PostInput[] }): { posts: PostType[] }[]
    category(
      args: CategoryGeneralType[] & CategoryMetaType[],
    ): CategoryGeneralType[] & CategoryMetaType[]
    categories(
      args: (CategoryGeneralType & CategoryMetaType)[],
    ): (CategoryGeneralType & CategoryMetaType)[]
    question(
      args: QuestionInput[] & { isWatched: boolean }[],
    ): QuestionType[] & { answers: string[] }
    answer(
      args: { id: number | undefined } & { names: string[] | null },
    ): ({ id: number | undefined } & { names: string[] | null })[]
  }
  mutations: {
    postSave(args: PostInput): PostType
    postsSave(args: { post: PostInput }): { post: PostType }[]
    postsBulkSave(args: { post: PostInput[] }[]): { post: PostType[] }[]
    categorySave(
      args: CategoryGeneralType & CategoryMetaType,
    ): CategoryGeneralType & CategoryMetaType
    categoryBulkSave(
      args: (CategoryGeneralType & CategoryMetaType)[],
    ): (CategoryGeneralType & CategoryMetaType)[]
    questionSave(
      args: QuestionInput & { isWatched: boolean },
    ): QuestionType & { answer: string }
    answerSave(
      args: { id: number | undefined } & { name: string[] | null },
    ): ({ id: number | undefined } & { name: string[] | null })[]
  }
  subscriptions: {
    onSimplePostSave(): PostSimpleType[]
    onPostSave(): PostType[]
    onPostsSave(): { posts: PostType[] }[]
    onCategorySave(): CategoryGeneralType[] & CategoryMetaType[]
    onCategoryBulkSave(): (CategoryGeneralType & CategoryMetaType)[]
    onQuestionSave(): QuestionType[] & { answers: string[] }
    onAnswerSave(): ({ id: number } & { names: string[] })[]
  }
}>()

type PostSimpleType = {
  id: number
  titles: string[]
}
type PostType = { id: number }

type PostSimpleInput = {
  id: number
  titles: string[]
}
type PostInput = PostGeneralType & PostMetaType

type QuestionType = QuestionGeneralType & QuestionMetaType

type QuestionInput = QuestionGeneralType & QuestionMetaType

type PostGeneralType = {
  id: number
  titles: string[] | undefined
}

type PostMetaType = {
  ratings: number[] | null
  statuses: StatusEnum[]
}

type CategoryGeneralType = {
  id: number
  titles: string[]
  posts: PostType[]
}

type CategoryMetaType = {
  ratings: bigint[]
}

type QuestionGeneralType = {
  id: number
  title: string
}

type QuestionMetaType = {
  ratings: number[]
  isAnswered: boolean[]
}

enum StatusEnum {
  /**
   * Is on draft.
   */
  draft = "draft",

  /**
   * Is published.
   */
  published = "published",
}
