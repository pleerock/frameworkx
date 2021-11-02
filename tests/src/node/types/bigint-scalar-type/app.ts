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
    postCreate(args: { title: string; views: bigint }): PostType
  }
  inputs: {}
  subscriptions: {}
  actions: {}
  context: {}
}>()
