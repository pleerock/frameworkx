import { createApp } from "@microframework/core"
import { PostType, StatusType } from "./models"

export const App = createApp<{
  models: {
    PostType: PostType
    StatusType: StatusType
  }
  queries: {
    post(args: { id: number }): PostType
  }
  mutations: {
    postCreate(args: { title: string; status: StatusType }): PostType
  }
}>()
