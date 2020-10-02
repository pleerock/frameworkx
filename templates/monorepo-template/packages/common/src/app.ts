import { createApp } from "@microframework/core"
import { Category, Post } from "./model"
import { CategorySaveInput, PostFilterInput, PostSaveInput } from "./input"

/**
 * Main application declarations file.
 */
export const App = createApp<{
  models: {
    Post: Post
    Category: Category
  }

  inputs: {
    PostSaveInput: PostSaveInput
    PostFilterInput: PostFilterInput
    CategorySaveInput: CategorySaveInput
  }

  queries: {
    /**
     * Loads all posts.
     */
    posts(input: PostFilterInput): Post[]

    /**
     * Loads a single category by its id.
     * Returns null if category was not found.
     */
    category(input: { id: number }): Category | null
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

    /**
     * Saves a category.
     *
     * If category id is given, it tries to update exist category.
     * If category id is not given, it will create a new category.
     */
    categorySave(input: CategorySaveInput): Category

    /**
     * Removes a category.
     * Returns false if category with a given id was not found.
     */
    categoryRemove(input: { id: number }): boolean
  }

  subscriptions: {
    /**
     * Event triggered when a new post was created.
     * Newly created post is emitted.
     */
    postCreated: Post
  }
}>()
