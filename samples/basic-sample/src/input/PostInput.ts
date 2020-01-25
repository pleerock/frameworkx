/**
 * This input is used to create a new post or update exist post.
 */
export type PostInput = {

    /**
     * Updating post id.
     */
    id?: number | null

    /**
     * Post title.
     */
    title: string

    /**
     * Post text.
     */
    text?: string | null

}
