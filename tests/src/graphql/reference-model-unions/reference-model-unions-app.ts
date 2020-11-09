import { createApp } from "@microframework/core"

export const App = createApp<{
  models: {
    PostType: PostType
    BlogPostType: BlogPostType
    NewsPostType: NewsPostType
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
