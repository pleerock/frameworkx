import { createApp } from "@microframework/core"

export const App = createApp<{
  models: {
    PostType: PostType
    PostStatusType: PostStatusType
  }
  inputs: {}
  queries: {}
  mutations: {}
  subscriptions: {}
  actions: {}
  context: {}
}>()

/**
 * Type for a PostStatus.
 */
type PostStatusType = "draft" | "published"

/**
 * Type for a PostType.
 */
type PostType = {
  id: number
  name: string
  status: PostStatusType
}
