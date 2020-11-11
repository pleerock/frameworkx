import { createApp } from "@microframework/core"

export const App = createApp<{
  models: {
    PostType: PostType
    CategoryType: {
      id: number
      name: string
    } & {
      posts: PostType
    }
  }
}>()

type PostType = {
  id: number
  title: string
} & {
  rating: number
}
