import {Model} from "@microframework/core";
import {CategoryType} from "./Category";
import {UserType} from "./User";

/**
 * Simple model for testing purposes.
 */
export type PostModel = Model<PostType, PostArgs>

/**
 * Type for a PostModel.
 */
export interface PostType {

    /**
     * Unique post id.
     */
    id: number

    /**
     * Post title.
     */
    title: string

    /**
     * Post content.
     */
    text: string

    /**
     * Indicates if post is active.
     */
    active: boolean

    /**
     * Post categories.
     */
    categories: CategoryType[]

    /**
     * Post creator.
     */
    author: UserType
}

/**
 * Args for a PostModel.
 */
export type PostArgs = {
    title: {
        /**
         * Keyword to search name by.
         */
        keyword: string | null
    }
}
