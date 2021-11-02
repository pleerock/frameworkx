import { createApp } from "@microframework/core"

export const App = createApp<{
  models: {
    PostType: PostType
  }
  subscriptions: {
    postCreated(): PostType
    postCreated(): PostType
  }
  inputs: {}
  queries: {}
  mutations: {}
  actions: {}
  context: {}
}>()

type PostType = {
  id: number
  name: string
}
