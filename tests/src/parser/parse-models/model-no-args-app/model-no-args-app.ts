import { createApp, ModelWithArgs } from "@microframework/core"

export const App = createApp<{
  models: {
    PostModelNoArgs: PostModelNoArgs
  }
}>()

/**
 * This way we are testing "Model" support.
 * "Model" is used when we also add "args",
 * but in the case when user wants a consistency and use Model everywhere,
 * even where he doesn't need args, he can omit this argument.
 */
export type PostModelNoArgs = ModelWithArgs<PostNoArgsType, any>

/**
 * Type for a PostModel.
 */
export type PostNoArgsType = {
  id: number
  name: string
}
