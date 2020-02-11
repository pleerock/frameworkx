import { createApp } from "@microframework/core"
import { PersonComplexType } from "../model/PersonComplexType"
import { PostModel } from "../model/PostModel"

export const App = createApp<{
    models: {
        PostModel: PostModel,
        PersonComplexType: PersonComplexType,
    },
}>()
