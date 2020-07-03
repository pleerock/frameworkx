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
    postCreate(args: {
      title: string
      status: "DRAFT" | "ON_MODERATION" | "PUBLISHED"
    }): PostType
  }
}>()
