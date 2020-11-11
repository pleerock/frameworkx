import { createApp } from "@microframework/core"

export const App = createApp<{
  inputs: {
    PostInput: PostStatusType
  }
}>()

type PostStatusType = "draft" | "published"
