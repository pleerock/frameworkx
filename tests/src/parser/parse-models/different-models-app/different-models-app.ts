import { createApp, ModelWithArgs } from "@microframework/core"

export const App = createApp<{
  models: {
    PostType: PostTypeModel
    PostClass: PostClassModel
    PostInterface: PostInterfaceModel
    PostLiteralModel: PostLiteralModel
  }
  inputs: {}
  queries: {}
  mutations: {}
  subscriptions: {}
  actions: {}
  context: {}
}>()

/**
 * This way we are testing "Model" support with a regular type.
 */
type PostTypeModel = ModelWithArgs<PostType, PostTypeArgs>

/**
 * This way we are testing "Model" support with a regular type.
 */
type PostClassModel = ModelWithArgs<PostClass, PostClassArgs>

/**
 * This way we are testing "Model" support with a regular type.
 */
type PostInterfaceModel = ModelWithArgs<PostInterface, PostInterfaceArgs>

/**
 * This way we are testing "Model" support with a literal type.
 */
type PostLiteralModel = ModelWithArgs<
  { id: number; name: string },
  { name: { keyword: string } }
>

/**
 * Type for a PostTypeModel.
 */
type PostType = {
  id: number
  name: string
}

/**
 * Args for a PostTypeModel.
 */
type PostTypeArgs = {
  name: {
    keyword: string
  }
}

/**
 * Class for a PostClassModel.
 */
class PostClass {
  id!: number
  name!: string
}

/**
 * Interface for a PostModel.
 */
interface PostInterface {
  id: number
  name: string
}

/**
 * Args for a PostClassModel.
 */
class PostClassArgs {
  name!: {
    keyword: string
  }
}

/**
 * Args for a PostInterfaceModel.
 */
interface PostInterfaceArgs {
  name: {
    keyword: string
  }
}
