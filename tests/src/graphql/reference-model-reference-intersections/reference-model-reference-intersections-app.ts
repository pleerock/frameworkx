import { createApp } from "@microframework/core"

export const App = createApp<{
  models: {
    PostType: PostType
  }
}>()

type PostType = PostGeneralType & PostMetaType

type PostGeneralType = {
  id: number
  title: string
}

type PostMetaType = {
  rating: number
}
