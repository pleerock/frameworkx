import { createApp } from "@microframework/core"
import { PostType } from "../model/PostType"
import { PostStatusType } from "../model/PostStatusType"

export const App = createApp<{
  models: {
    PostType: PostType
    PostStatusType: PostStatusType
  }
}>()
