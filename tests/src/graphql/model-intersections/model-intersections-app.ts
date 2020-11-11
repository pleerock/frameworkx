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
}>()

type PostType = PostGeneralType & PostMetaType
type QuestionType = QuestionGeneralType & QuestionMetaType

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
