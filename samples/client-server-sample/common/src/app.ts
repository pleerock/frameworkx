import {createApp} from "@microframework/core";
import {PostFilterInput} from "./input/PostFilterInput";
import {CategoryInput} from "./input/CategoryInput";
import {PostInput} from "./input/PostInput";
import {CategoryType} from "./model/Category";
import {PostModel, PostType} from "./model/Post";
import {UserType} from "./model/User";

export const app = createApp<{
    models: {
        PostType: PostModel
        UserType: UserType
        CategoryType: CategoryType
    }
    inputs: {
        PostInput: PostInput
        PostFilterInput: PostFilterInput
        CategoryInput: CategoryInput
    }
    actions: {
        "GET /posts": {
            return: PostType[]
            query: {
                limit: number
                offset: number
            }
        }
        "GET /posts/:id": {
            return: PostType
            params: {
                id: number
            }
        }
        "POST /posts": {
            return: {
                id: number
            }
            body: {
                id: number
                title: string
                text: string
            }
        }
        "DELETE /posts/:id": {
            return: boolean
            params: {
                id: number
            }
        }
    }
    queries: {

        /**
         * Loads all posts.
         */
        posts(args: PostFilterInput): PostModel[] // todo: need to check if we can make selections to work with PostType instead of Model

        /**
         * Loads a single category.
         */
        category(): CategoryType

    }
    mutations: {

        /**
         * Saves a post.
         */
        postSave(args: PostInput): PostModel

        /**
         * Removes a post with a given id.
         */
        postRemove(args: { id: number }): boolean

    }
    context: {
        currentUser: {
            id: number
        }
    }
}>()
