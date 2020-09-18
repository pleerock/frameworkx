import { createApp } from "@microframework/core"
import { RedisPubSub } from "graphql-redis-subscriptions"
import {
  PostFilterInput,
  PostType,
  CategoryType,
  PostSearchInput,
} from "./models"

export const App = createApp<{
  inputs: {
    PostFilterInput: PostFilterInput
    PostSearchInput: PostSearchInput
  }
  models: {
    PostType: PostType
    CategoryType: CategoryType
  }
  queries: {
    postRandomOne(): PostType
    post(args: { id: number }): PostType | null
    posts(args: PostFilterInput): PostType[]
    postsSearch(args: PostSearchInput): PostType[]
  }
  mutations: {
    postCreate(args: { title: string }): PostType
    postRemove(args: { id: number }): boolean
    postRemoveAll(): boolean
  }
  subscriptions: {
    postCreated: PostType // (args: { ids: number[] }): PostType
    postRemoved: PostType
  }
  actions: {
    "GET /posts": {
      return: PostType[]
    }
    "GET /posts/:id": {
      params: {
        id: number
      }
      return: PostType | null
    }
    "GET /posts-one-by-qs": {
      query: {
        id: number
      }
      return: PostType | null
    }
  }
  context: {
    appPubSub: RedisPubSub
  }
}>()
