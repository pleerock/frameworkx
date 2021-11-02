import { createApp, ModelWithArgs } from "@microframework/core"

export const App = createApp<{
  models: {
    PostType: PostModel
  }
  inputs: {}
  queries: {}
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
    keyword: string
  }
}
