import { createApp } from "@microframework/core"
import { RedisPubSub } from "graphql-redis-subscriptions"

export const App = createApp<{
  models: {
    PostType: PostType
  }
  inputs: {
    PostInput: PostInput
  }
  queries: {
    post(input: { id: number }): PostType
    post(input: { id: number }): CategoryType
    post(input: { id: number }): { foo: string } & { a: string }
    posts(input: CategoryInput): PostType[]
    posts(input: CategoryInput): PostType[]
  }
  mutations: {
    postSave(input: { id: number }): PostType
    postSave(input: { id: number }): CategoryType
  }
  subscriptions: {
    postCreated(): PostType
    postCreated(): CategoryType
  }
  actions: {
    "GET /posts": {
      return: PostType[]
    }
  }
  context: {
    appPubSub: RedisPubSub
  }
}>()

type CategoryType = {
  type: string
}

type PostType = {
  id: number
  name: string
}

type PostInput = {
  type: string
}

type CategoryInput = {
  id: number
  name: string
}
