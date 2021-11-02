import { createApp, ModelWithArgs } from "@microframework/core"

export const App = createApp<{
  models: {
    PostType: PostModel
    CategoryType: CategoryType
  }
  inputs: {
    PostInput: PostInput
    PostFilterInput: PostFilterInput
    CategoryInput: CategoryInput
  }
  queries: {
    posts(args: PostFilterInput): PostType[]
    post(args: { id: number }): PostType
    category(): CategoryType
    categories(): CategoryType[]
    categoryCount(): number
  }
  mutations: {
    postSave(args: PostInput): PostType
    postRemove(args: { id: number }): boolean
    categoriesSave(args: CategoryInput[]): { id: number }[]
  }
  subscriptions: {}
  actions: {}
  context: {}
}>()

/**
 * Simple model for testing purposes.
 */
type PostModel = ModelWithArgs<PostType, PostArgs>

/**
 * Type for a PostModel.
 */
type PostType = {
  id: number
  name: string
}

/**
 * Args for a PostModel.
 */
type PostArgs = {
  name: {
    keyword: string
  }
}

/**
 * Dummy type.
 */
type CategoryType = {
  id: number
  name: string
}

/**
 * Simple input for testing purposes.
 */
type PostInput = {
  id: number
  name: string
}

/**
 * Simple input for testing purposes.
 */
type PostFilterInput = {
  id: number
  name: string | undefined
}

/**
 * Simple input for testing purposes.
 */
type CategoryInput = {
  id: number
  name: string | null
}
