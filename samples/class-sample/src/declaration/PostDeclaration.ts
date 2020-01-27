import { PostFilterInput } from "../input/PostFilterInput"
import { PostInput } from "../input/PostInput"
import { PostModel, PostType } from "../model/Post"

/**
 * Declarations for Post.
 */
export type PostDeclaration = {
  models: {
    PostType: PostModel
  }

  inputs: {
    PostInput: PostInput
    PostFilterInput: PostFilterInput
  }

  queries: {
    /**
     * Loads all posts.
     */
    posts(args: PostFilterInput): PostType[]
  }

  mutations: {
    /**
     * Saves a post.
     */
    postSave(args: PostInput): PostType

    /**
     * Removes a post with a given id.
     */
    postRemove(args: { id: number }): boolean
  }
}
