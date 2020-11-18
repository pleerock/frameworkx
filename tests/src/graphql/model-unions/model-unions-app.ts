import { createApp } from "@microframework/core"

export const App = createApp<{
  models: {
    BlogPostType: BlogPostType
    NewsPostType: NewsPostType
    PostType: PostType
    PostWatchedType: PostWatchedType
    // PostExtendedType: PostType | PostWatchedType
  }
}>()

type PostType = BlogPostType | NewsPostType

type PostWatchedType = {
  id: number
  text: string
  watched: boolean
  watchCount: number
}

type BlogPostType = {
  id: number
  text: string
}

type NewsPostType = {
  id: number
  title: string
}
