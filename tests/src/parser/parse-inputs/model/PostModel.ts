import { ModelWithArgs } from "@microframework/core"

/**
 * Simple model for testing purposes.
 */
export type PostModel = ModelWithArgs<PostType, any>

/**
 * Type for a PostModel.
 */
export type PostType = {
    id: number
    name: string
}
