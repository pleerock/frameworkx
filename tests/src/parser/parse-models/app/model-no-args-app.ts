import {createApp} from "@microframework/core";
import {PostModelNoArgs} from "../model/PostModelNoArgs";

export const App = createApp<{
    models: {
        PostModelNoArgs: PostModelNoArgs,
    },
}>()
