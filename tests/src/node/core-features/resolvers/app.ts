import { createApp } from "@microframework/core"
import { PostType } from "./models"

export const App = createApp<{
  actions: {
    "get /posts": {
      return: PostType[]
    }
    "get /post/:id": {
      params: {
        id: number
      }
      return: PostType
    }
  }
  models: {
    PostType: PostType
  }
  queries: {
    posts(): PostType[]
    post(args: { id: number }): PostType
    postFromSession(): PostType
    postMaybe(args: { id: number }): PostType | undefined
  }
  context: {
    sessionPost: PostType
  }
}>()
