import {ApplicationOptionsOf} from "@microframework/core";
import {PostInputInterface} from "../input/PostInputInterface";
import {PostModel} from "../model/PostModel";

export type App = ApplicationOptionsOf<{
    models: [
        PostModel,
    ],
    inputs: [
        PostInputInterface,
    ],
}>
