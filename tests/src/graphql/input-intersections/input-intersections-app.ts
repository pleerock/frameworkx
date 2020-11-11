import { createApp } from "@microframework/core"

export const App = createApp<{
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
}>()

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
