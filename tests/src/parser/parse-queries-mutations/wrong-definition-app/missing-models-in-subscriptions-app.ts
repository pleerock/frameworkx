import { createApp } from "@microframework/core"

export const App = createApp<{
  models: {
    CategoryType: CategoryType
  }
  subscriptions: {
    postCreated(): PostType
  }
}>()

type CategoryType = {
  type: string
}

type PostType = {
  id: number
  name: string
}
