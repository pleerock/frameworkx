import {PostType} from "./Post";

/**
 * Dummy type.
 */
export type CategoryType = {

    /**
     * Category id.
     */
    id: number

    /**
     * Category name. Can be empty.
     */
    name: string | null

    /**
     * All posts attached to this category.
     */
    posts: PostType[]
}
