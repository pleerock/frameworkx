import { createApp } from "@microframework/core"
import { PostInputInterface } from "../input/PostInputInterface"
import { PostModel } from "../model/PostModel"

export const App = createApp<{
  models: {
    PostModel: PostModel
  }
  inputs: {
    PostInputInterface: PostInputInterface
  }
}>()
