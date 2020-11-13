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
    question(
      args: QuestionInput & { isWatched: boolean },
    ): QuestionType & { answer: string }
    answer(
      args: { id: number } & { name: string },
    ): { id: number } & { name: string }
  }
}>()

type PostType = PostGeneralType & PostMetaType
type QuestionType = QuestionGeneralType & QuestionMetaType

type PostInput = PostGeneralType & PostMetaType
type QuestionInput = QuestionGeneralType & QuestionMetaType

type PostGeneralType = {
  id: number
  title: string
}

type PostMetaType = {
  rating: number
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
