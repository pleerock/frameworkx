import {createApp} from "@microframework/core";
import {PostModel} from "../model/PostModel";
import {PostInputClass} from "../input/PostInputClass";

export const App = createApp<{
    models: [
        PostModel,
    ],
    inputs: [
        PostInputClass,
    ],
}>()
