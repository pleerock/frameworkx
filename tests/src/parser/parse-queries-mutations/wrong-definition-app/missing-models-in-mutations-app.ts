import { createApp } from "@microframework/core"

export const App = createApp<{
  models: {
    CategoryType: CategoryType
  }
  mutations: {
    postSave(input: { id: number }): PostType
  }
}>()

type CategoryType = {
  type: string
}

type PostType = {
  id: number
  name: string
}
