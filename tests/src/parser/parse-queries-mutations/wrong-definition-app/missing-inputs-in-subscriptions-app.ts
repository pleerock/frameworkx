import { createApp } from "@microframework/core"

export const App = createApp<{
  inputs: {
    CategoryInput: CategoryInput
  }
  subscriptions: {
    postCreated(input: PostInput): { id: number }
  }
}>()

type CategoryInput = {
  type: string
}

type PostInput = {
  id: number
  name: string
}
