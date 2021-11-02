import { createApp, ModelWithArgs } from "@microframework/core"

export const App = createApp<{
  models: {
    PostType: PostModel
  }
  inputs: {
    PostInputInterface: PostInputInterface
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
 * This way we are testing interface support.
 */
interface PostInputInterface {
  id: number
  name: string
}
