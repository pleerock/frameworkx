import { createApp, ModelWithArgs } from "@microframework/core"

export const App = createApp<{
  models: {
    PostType: PostModel
  }
  inputs: {
    PostInputType: PostInputType
  }
  queries: {}
  mutations: {}
  subscriptions: {}
  actions: {}
  context: {}
}>()

/**
 * Simple model for testing purposes.
 */
type PostModel = ModelWithArgs<PostType, any>

/**
 * Type for a PostModel.
 */
type PostType = {
  id: number
  name: string
}

/**
 * This way we are testing type support.
 */
type PostInputType = {
  id: number
  name: string
}
