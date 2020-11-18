import { createApp } from "@microframework/core"

export const App = createApp<{
  models: {
    PostType: PostType
    PostExtendedType:
      | PostType
      | { id: number; text: string; isWatched: boolean } // todo: this signature can't be supported
    CategoryType: PostCategory | QuestionCategory
    QuestionType: { id: number; name: string } | { id: number; title: string } // todo: this signature can't be supported
  }
}>()

type PostType = BlogPostType | NewsPostType

type BlogPostType = {
  id: number
  text: string
}

type NewsPostType = {
  id: number
  title: string
}

type PostCategory = {
  id: number
  title: string
}

type QuestionCategory = {
  id: number
  title: string
}
