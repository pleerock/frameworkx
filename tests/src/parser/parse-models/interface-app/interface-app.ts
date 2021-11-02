import { createApp } from "@microframework/core"

export const App = createApp<{
  models: {
    PhotoInterface: PhotoInterface
  }
  inputs: {}
  queries: {}
  mutations: {}
  subscriptions: {}
  actions: {}
  context: {}
}>()

/**
 * This way we are testing interface support.
 */
interface PhotoInterface {
  id: number
  filename: string
}
