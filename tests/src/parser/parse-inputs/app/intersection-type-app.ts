import {createApp} from "@microframework/core";
import {PersonIntersectionInputType} from "../input/PersonIntersectionInputType";
import {PostModel} from "../model/PostModel";

export const App = createApp<{
    models: [
        PostModel,
    ],
    inputs: [
        PersonIntersectionInputType,
    ],
}>()
