import { createApp } from "@microframework/core"
import { RedisPubSub } from "graphql-redis-subscriptions"
import { PubSub } from "graphql-subscriptions"
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
  context: {
    appPubSub: RedisPubSub
  }
}>()
