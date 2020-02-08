
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
    // categories: CategoryType[]

    /**
     * Post creator.
     */
    // author: UserType
}
