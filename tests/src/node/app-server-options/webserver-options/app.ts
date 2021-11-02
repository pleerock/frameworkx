import { createApp } from "@microframework/core"
import { PostType } from "./models"

export const App = createApp<{
  actions: {
    "get /posts": {
      return: PostType[]
    }
    "post /posts": {
      return: PostType[]
    }
  }
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
  context: {}
}>()
