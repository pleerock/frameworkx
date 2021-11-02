import { createApp } from "@microframework/core"
import { PostType } from "./models"

export const App = createApp<{
  models: {
    PostType: PostType
  }
  queries: {
    post(args: { id: number }): PostType
  }
  mutations: {
    postSave(args: { id: number }): boolean
  }
  inputs: {}
  subscriptions: {}
  actions: {}
  context: {}
}>()
