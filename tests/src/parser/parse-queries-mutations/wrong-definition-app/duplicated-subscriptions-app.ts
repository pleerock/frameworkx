import { createApp } from "@microframework/core"

export const App = createApp<{
  models: {
    PostType: PostType
  }
  subscriptions: {
    postCreated(): PostType
    postCreated(): PostType
  }
}>()

type PostType = {
  id: number
  name: string
}
