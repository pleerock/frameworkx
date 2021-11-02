import { createApp } from "@microframework/core"
import { PostInput, PostType } from "./models"

export const App = createApp<{
  models: {
    PostType: PostType
  }
  inputs: {
    PostInput: PostInput
  }
  queries: {
    post(args: { id: number }): PostType
  }
  mutations: {
    postCreate(args: PostInput): PostType
  }
  subscriptions: {}
  actions: {}
  context: {}
}>()
