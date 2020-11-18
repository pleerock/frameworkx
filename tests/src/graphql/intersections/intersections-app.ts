import { createApp } from "@microframework/core"

export const App = createApp<{
  models: {
    PostType: PostType
    CategoryType: CategoryGeneralType & CategoryMetaType
    PostCategoryType: {
      post: PostType
      category: CategoryGeneralType & CategoryMetaType
    }
    QuestionType: QuestionType & { answer: string }
    AnswerType: { id: number } & { name: string }
  }
  inputs: {
    PostInput: PostInput
    CategoryInput: CategoryGeneralType & CategoryMetaType
    PostCategoryInput: {
      post: PostInput
      category: CategoryGeneralType & CategoryMetaType
    }
    QuestionInput: QuestionInput & { answer: string }
    AnswerInput: { id: number } & { name: string }
  }
  queries: {
    post(args: PostInput): PostType
    posts(args: { post: PostInput[] }): { post: PostType[] }[]
    category(
      args: CategoryGeneralType & CategoryMetaType,
    ): CategoryGeneralType & CategoryMetaType
    categories(
      args: (CategoryGeneralType & CategoryMetaType)[],
    ): (CategoryGeneralType & CategoryMetaType)[]
    question(
      args: QuestionInput & { isWatched: boolean },
    ): QuestionType & { answer: string }
    answer(
      args: { id: number | undefined } & { name: string | null },
    ): { id: number | undefined } & { name: string | null }
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
      args: { id: number | undefined } & { name: string | null },
    ): { id: number | undefined } & { name: string | null }
  }
  subscriptions: {
    onPostSave(): PostType
    onPostsSave(): { post: PostType }[]
    onCategorySave(): CategoryGeneralType & CategoryMetaType
    onCategoryBulkSave(): (CategoryGeneralType & CategoryMetaType)[]
    onQuestionSave(): QuestionType & { answer: string }
    onAnswerSave(): { id: number } & { name: string }
  }
}>()

type PostType = PostGeneralType & PostMetaType
type QuestionType = QuestionGeneralType & QuestionMetaType

type PostInput = PostGeneralType & PostMetaType
type QuestionInput = QuestionGeneralType & QuestionMetaType

type PostGeneralType = {
  id: number
  title: string | undefined
}

type PostMetaType = {
  rating: number | null
}

type CategoryGeneralType = {
  id: number
  title: string
}

type CategoryMetaType = {
  rating: number
}

type QuestionGeneralType = {
  id: number
  title: string
}

type QuestionMetaType = {
  rating: number
}
