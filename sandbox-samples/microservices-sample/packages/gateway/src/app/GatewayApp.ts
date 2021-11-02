import { createApp } from "@microframework/core"
import { Post, Category, User } from "../model"
import { PostSaveInput, CategorySaveInput, UserRegisterInput } from "../input"

/**
 * Main application declarations file.
 */
export const GatewayApp = createApp<{
  models: {
    Post: Post
    Category: Category
    User: User
  }

  inputs: {
    PostSaveInput: PostSaveInput
    CategorySaveInput: CategorySaveInput
    UserRegisterInput: UserRegisterInput
  }

  queries: {
    /**
     * Loads all posts.
     */
    posts(): Post[]

    /**
     * Loads a single category by its id.
     * Returns null if category was not found.
     */
    category(input: { id: number }): Category | null

    /**
     * Loads all users.
     */
    users(): User[]
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

    /**
     * Registers a new user.
     */
    userRegister(input: UserRegisterInput): User
  }

  subscriptions: {}
  actions: {}
  context: {}
}>()
