import {ApplicationOptionsOf} from "@microframework/core";
import {PostFilterInput} from "../input/PostFilterInput";
import {PostInput} from "../input/PostInput";
import {CategoryInput} from "../input/CategoryInput";
import {CategoryType} from "../model/Category";
import {PostModel} from "../model/PostModel";

export type App = ApplicationOptionsOf<{
    models: [
        PostModel,
        CategoryType,
    ],
    inputs: [
        PostInput,
        PostFilterInput,
        CategoryInput,
    ],
    queries: {
        posts(args: PostFilterInput): PostModel[],
        post(args: { id: number }): PostModel,
        category(): CategoryType,
        categories(): CategoryType[],
    },
    mutations: {
        postSave(args: PostInput): PostModel,
        postRemove(args: { id: number }): boolean,
        categoriesSave(args: CategoryInput[]): { id: number }[]
    },
}>
