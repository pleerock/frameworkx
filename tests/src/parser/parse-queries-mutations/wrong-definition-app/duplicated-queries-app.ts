import { createApp } from "@microframework/core"

export const App = createApp<{
  models: {
    PostType: PostType
  }
  queries: {
    post(input: { id: number }): PostType
    post(input: { id: number }): PostType
  }
  inputs: {}
  mutations: {}
  subscriptions: {}
  actions: {}
  context: {}
}>()

type PostType = {
  id: number
  name: string
}
