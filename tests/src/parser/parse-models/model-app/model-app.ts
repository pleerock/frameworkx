import { createApp, ModelWithArgs } from "@microframework/core"

export const App = createApp<{
  models: {
    PostModel: PostModel
  }
}>()

/**
 * Simple model for testing purposes.
 */
export type PostModel = ModelWithArgs<PostType, PostArgs>

/**
 * Type for a PostModel.
 */
export type PostType = {
  id: number
  name: string
}

/**
 * Args for a PostModel.
 */
export type PostArgs = {
  name: {
    keyword: string
  }
}
