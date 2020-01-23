import {Model} from "@microframework/core";

/**
 * Simple model for testing purposes.
 */
export type PostModel = Model<PostType>

/**
 * Type for a PostModel.
 */
export type PostType = {
    id: number
    name: string
}
