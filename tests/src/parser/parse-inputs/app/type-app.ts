import { createApp } from "@microframework/core"
import { PostInputType } from "../input/PostInputType"
import { PostModel } from "../model/PostModel"

export const App = createApp<{
  models: {
    PostModel: PostModel
  }
  inputs: {
    PostInputType: PostInputType
  }
}>()
