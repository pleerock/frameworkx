import { createApp } from "@microframework/core"
import { Post } from "../model"
import { PostFilterInput, PostSaveInput } from "../input"

/**
 * Main application declarations file.
 */
export const PostApp = createApp<{
  models: {
    Post: Post
  }

  inputs: {
    PostSaveInput: PostSaveInput
    PostFilterInput: PostFilterInput
  }

  queries: {
    /**
     * Loads all posts.
     */
    posts(input: PostFilterInput): Post[]
  }

  mutations: {
    /**
     * Saves a post.
     *
     * If post id is given, it tries to update exist post.
     * If post id is not given, it will create a new post.
     */
    postSave(input: PostSaveInput): Post

    /**
     * Removes a post with a given id.
     * Returns false if post with a given id was not found.
     */
    postRemove(input: { id: number }): boolean
  }

  subscriptions: {
    /**
     * Event triggered when a new post was created.
     * Newly created post is emitted.
     */
    postCreated(): Post
  }
}>()
