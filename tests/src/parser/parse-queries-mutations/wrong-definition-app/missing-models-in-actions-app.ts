import { createApp } from "@microframework/core"
import { RedisPubSub } from "graphql-redis-subscriptions"

export const App = createApp<{
  models: {
    CategoryType: CategoryType
  }
  actions: {
    "GET /posts": {
      return: PostType[]
    }
  }
}>()

type CategoryType = {
  type: string
}

type PostType = {
  id: number
  name: string
}
