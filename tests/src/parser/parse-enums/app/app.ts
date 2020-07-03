import { createApp } from "@microframework/core"
import { PostStatusType } from "../model/PostStatusType"
import { PostType } from "../model/PostType"

export const App = createApp<{
  models: {
    PostType: PostType
    PostStatusType: PostStatusType
  }
}>()
