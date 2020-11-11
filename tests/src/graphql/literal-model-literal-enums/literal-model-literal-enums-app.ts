import { createApp } from "@microframework/core"

export const App = createApp<{
  models: {
    PostType: {
      id: number
      name: string
      status: "draft" | "published"
    }
  }
}>()
