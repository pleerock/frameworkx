import { createApp } from "@microframework/core"
import {
  PostClassModel,
  PostInterfaceModel,
  PostLiteralModel,
  PostTypeModel,
} from "../model/DifferentModels"

export const App = createApp<{
  models: {
    PostType: PostTypeModel
    PostClass: PostClassModel
    PostInterface: PostInterfaceModel
    PostLiteralModel: PostLiteralModel
  }
}>()
