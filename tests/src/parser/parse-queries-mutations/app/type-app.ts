import { createApp } from "@microframework/core";
import { CategoryInput } from "../input/CategoryInput";
import { PostFilterInput } from "../input/PostFilterInput";
import { PostInput } from "../input/PostInput";
import { CategoryType } from "../model/Category";
import { PostModel } from "../model/PostModel";

export const App = createApp<{
    models: {
        PostType: PostModel,
        CategoryType: CategoryType,
    },
    inputs: {
        PostInput: PostInput,
        PostFilterInput: PostFilterInput,
        CategoryInput: CategoryInput,
    },
    queries: {
        posts(args: PostFilterInput): PostModel[],
        post(args: { id: number }): PostModel,
        category(): CategoryType,
        categories(): CategoryType[],
        categoryCount(): number
    },
    mutations: {
        postSave(args: PostInput): PostModel,
        postRemove(args: { id: number }): boolean,
        categoriesSave(args: CategoryInput[]): { id: number }[]
    },
}>()
