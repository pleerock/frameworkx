import { createApp } from "@microframework/core"

export const App = createApp<{
  models: {
    PostType: PostType
  }
  mutations: {
    postSave(input: { id: number }): PostType
    postSave(input: { id: number }): PostType
  }
  inputs: {}
  queries: {}
  subscriptions: {}
  actions: {}
  context: {}
}>()

type PostType = {
  id: number
  name: string
}
