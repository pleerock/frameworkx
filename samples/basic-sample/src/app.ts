import {createApp} from "@microframework/core";
import {Status} from "./enum/Status";
import {PostFilterInput} from "./input/PostFilterInput";
import {CategoryInput} from "./input/CategoryInput";
import {PostInput} from "./input/PostInput";
import {CategoryType} from "./model/Category";
import {PostModel, PostType} from "./model/Post";
import {UserType} from "./model/User";
import {SearchType} from "./model/Search";

export const app = createApp<{
    actions: {
        "GET /posts": {
            return: PostType[]
            query: {
                limit: number
                offset: number
            }
        },
        "GET /posts/:id": {
            return: PostType
            params: {
                id: number
            }
        },
        "POST /posts": {
            return: {
                id: number
            }
            body: {
                id: number
                title: string
                text: string
            }
        },
        "DELETE /posts/:id": {
            return: boolean
            params: {
                id: number
            }
        },
    }
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
    queries: {

        /**
         * Loads all posts.
         */
        posts(args: PostFilterInput): PostModel[] // todo: need to check if we can make selections to work with PostType instead of Model

        /**
         * Loads a single category.
         */
        category(): CategoryType

        /**
         * Loads users.
         */
        users(args: { status: Status }): UserType[]

        /**
         * Searching any data we have.
         */
        search(): SearchType[]

    },
    mutations: {

        /**
         * Saves a post.
         */
        postSave(args: PostInput): PostModel

        /**
         * Removes a post with a given id.
         */
        postRemove(args: { id: number }): boolean

        /**
         * Saves a post.
         */
        category(args: PostInput): PostModel

    },
    subscriptions: {

        /**
         * Fires when a new post added.
         */
        postAdded(): PostModel

        /**
         * Fires when post was removed.
         */
        postRemoved(): boolean

    }
    context: {
        currentUser: {
            id: number
        }
    }
}>()
