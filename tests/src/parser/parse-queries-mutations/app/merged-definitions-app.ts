import { createApp } from "@microframework/core";
import { CategoryType } from "../model/Category";
import { PostModel } from "../model/PostModel";
import { CategoryQueries } from "../query/CategoryQueries";
import { PostQueries } from "../query/PostQueries";

export const App = createApp<{
    models: {
        PostType: PostModel,
        CategoryType: CategoryType,
    },
    queries:
        & PostQueries
        & CategoryQueries
}>()
