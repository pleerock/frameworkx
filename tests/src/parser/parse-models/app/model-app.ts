import { createApp } from "@microframework/core";
import { PostModel } from "../model/PostModel";

export const App = createApp<{
    models: {
        PostModel: PostModel,
    },
}>()
