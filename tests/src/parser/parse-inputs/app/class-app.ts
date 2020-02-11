import { createApp } from "@microframework/core"
import { PostInputClass } from "../input/PostInputClass"
import { PostModel } from "../model/PostModel"

export const App = createApp<{
    models: {
        PostModel: PostModel,
    },
    inputs: {
        PostInputClass: PostInputClass,
    },
}>()
