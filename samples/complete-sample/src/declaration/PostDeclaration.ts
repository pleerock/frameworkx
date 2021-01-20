import { PostFilterInput, PostInput } from "../input"
import { Post } from "../model"

/**
 * Declarations for Post.
 */
export type PostDeclaration = {
  models: {
    Post: Post
  }

  inputs: {
    PostInput: PostInput
    PostFilterInput: PostFilterInput
  }

  queries: {
    /**
     * Loads all posts.
     */
    posts(args: PostFilterInput): Post[]
  }

  mutations: {
    /**
     * Saves a post.
     */
    postSave(args: PostInput): Post

    /**
     * Removes a post with a given id.
     */
    postRemove(args: { id: number }): boolean
  }

  subscriptions: {
    /**
     * Called when a new post was added.
     */
    postAdded(): Post
  }
}
