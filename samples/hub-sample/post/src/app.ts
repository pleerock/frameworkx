import { createApp } from "@microframework/core"
import { Post, PostModel } from "./model/Post"
import { PostFilterInput } from "./input/PostFilterInput"
import { PostInput } from "./input/PostInput"

/**
 * Post application declaration.
 */
export const PostApp = createApp<{
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

    /**
     * Loads a single post by a given post id.
     */
    post(args: { id: number }): Post | null
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
}>()
