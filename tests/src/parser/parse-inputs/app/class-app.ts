import {ApplicationOptionsOf} from "@microframework/core";
import {PostModel} from "../model/PostModel";
import {PostInputClass} from "../input/PostInputClass";

export type App = ApplicationOptionsOf<{
    models: [
        PostModel,
    ],
    inputs: [
        PostInputClass,
    ],
}>
