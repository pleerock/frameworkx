import { PostFilterInput } from "../input/PostFilterInput"
import { PostInput } from "../input/PostInput"
import { PostModel, Post } from "../model/Post"

/**
 * Declarations for Post.
 */
export type PostDeclaration = {
  models: {
    Post: PostModel
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
}
