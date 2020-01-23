import {ApplicationOptionsOf} from "@microframework/core";
import {PostInputType} from "../input/PostInputType";
import {PostModel} from "../model/PostModel";

export type App = ApplicationOptionsOf<{
    models: [
        PostModel,
    ],
    inputs: [
        PostInputType,
    ],
}>
