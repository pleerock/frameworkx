import {ApplicationOptionsOf} from "@microframework/core";
import {PersonIntersectionInputType} from "../input/PersonIntersectionInputType";
import {PostModel} from "../model/PostModel";

export type App = ApplicationOptionsOf<{
    models: [
        PostModel,
    ],
    inputs: [
        PersonIntersectionInputType,
    ],
}>
