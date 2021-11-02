import { createApp, ModelWithArgs } from "@microframework/core"

export const App = createApp<{
  models: {
    PostType: PostModel
  }
  inputs: {
    PostInputClass: PostInputClass
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
 * This way we are testing class support.
 */
class PostInputClass {
  id!: number
  name!: string
}
