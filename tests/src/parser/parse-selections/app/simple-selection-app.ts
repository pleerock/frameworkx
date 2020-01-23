import {ApplicationOptionsOf, SelectionOf} from "@microframework/core";
import {CategoryInput} from "../input/CategoryInput";
import {PostFilterInput} from "../input/PostFilterInput";
import {PostInput} from "../input/PostInput";
import {CategoryType} from "../model/Category";
import {PostModel} from "../model/PostModel";
import {FullCategory} from "../selection/FullCategory";
import {FullPost} from "../selection/FullPost";

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
    selections: {
        fullPost: SelectionOf<PostModel, FullPost>,
        postWithId: SelectionOf<PostModel, { id: number }>,
        fullCategory: SelectionOf<CategoryType, FullCategory>,
        categoryWithId: SelectionOf<CategoryType, { id: number }>,
    }
}>
