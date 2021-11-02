import { createApp, ModelWithArgs } from "@microframework/core"

export const App = createApp<{
  models: {
    PostType: PostModel
    CategoryType: CategoryType
  }
  queries: PostQueries & CategoryQueries
  inputs: {}
  mutations: {}
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
    keyword: string | undefined
  }
}

/**
 * Dummy type.
 */
type CategoryType = {
  id: number
  name: string
}

type PostQueries = {
  post(): PostModel
  posts(): PostModel[]
}

type CategoryQueries = {
  category(): CategoryType
  categories(): CategoryType[]
}
