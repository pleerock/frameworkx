import {createApp} from "@microframework/core";
import {CategoryDeclaration} from "./declaration/CategoryDeclaration";
import {PostDeclaration} from "./declaration/PostDeclaration";
import {SearchDeclaration} from "./declaration/SearchDeclaration";
import {CategoryInput} from "./input/CategoryInput";
import {PostFilterInput} from "./input/PostFilterInput";
import {PostInput} from "./input/PostInput";
import {CategoryType} from "./model/Category";
import {PostModel} from "./model/Post";
import {SearchType} from "./model/Search";
import {UserType} from "./model/User";

export const app = createApp<{
    models: {
        PostType: PostModel
        UserType: UserType
        CategoryType: CategoryType
        SearchType: SearchType
    },
    inputs: {
        PostInput: PostInput
        PostFilterInput: PostFilterInput
        CategoryInput: CategoryInput
    },
}
    & CategoryDeclaration
    & PostDeclaration
    & SearchDeclaration
>()
