import { createApp, DateTime, Float, Time } from "@microframework/core"
import { RedisPubSub } from "graphql-redis-subscriptions"
import {
  CategoryType,
  ContentType,
  PostFilterInput,
  PostSearchInput,
  PostType,
} from "./models"

export const App = createApp<{
  models: {
    PostType: PostType
    CategoryType: CategoryType
  }
  inputs: {}
  queries: {
    postRandomOne(): PostType
    post(args: { id: number }): PostType | null
    posts(args: PostFilterInput): PostType[]
    postsSearch(args: PostSearchInput): PostType[]
    content(args: { type: ContentType }): ContentType
    contentByDate(args: { date: Date }): Date
    contentByTime(args: { date: Time }): Time
    contentByDateTime(args: { date: DateTime }): DateTime
  }
  mutations: {
    postCreate(args: { title: string }): PostType
    postRemove(args: { id: number }): boolean
    postRemoveAll(): boolean
  }
  subscriptions: {
    postCreated(): PostType // (args: { ids: number[] }): PostType
    postRemoved(): PostType
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
    "GET /posts-params/:number/:string/:boolean/:bigint/:bigintObj/:date/:dateTime/:time/:float/:object": {
      params: {
        number: number
        string: string
        boolean: boolean
        bigint: bigint
        bigintObj: BigInt
        date: Date
        dateTime: DateTime
        time: Time
        float: Float
        object: { id: number; name: string }
      }
      return: {
        number: number
        string: string
        boolean: boolean
        bigint: bigint
        bigintObj: BigInt
        date: Date
        dateTime: DateTime
        time: Time
        float: Float
        object: { id: number; name: string }
      }
    }
    "GET /posts-default-headers": {
      headers?: {
        number: number
        string: string
        boolean: boolean
        bigint: bigint
        bigintObj: BigInt
        date: Date
        dateTime: DateTime
        time: Time
        float: Float
        object: { id: number; name: string }
      }
      return:
        | {
            number: number
            string: string
            boolean: boolean
            bigint: bigint
            bigintObj: BigInt
            date: Date
            dateTime: DateTime
            time: Time
            float: Float
            object: { id: number; name: string }
          }
        | undefined
    }
    "GET /posts-headers": {
      headers: {
        number: number
        string: string
        boolean: boolean
        bigint: bigint
        bigintObj: BigInt
        date: Date
        dateTime: DateTime
        time: Time
        float: Float
        object: { id: number; name: string }
      }
      return: {
        number: number
        string: string
        boolean: boolean
        bigint: bigint
        bigintObj: BigInt
        date: Date
        dateTime: DateTime
        time: Time
        float: Float
        object: { id: number; name: string }
      }
    }
    "GET /posts-query": {
      query: {
        number: number
        string: string
        boolean: boolean
        bigint: bigint
        bigintObj: BigInt
        date: Date
        dateTime: DateTime
        time: Time
        float: Float
        object: { id: number; name: string }
      }
      return: {
        number: number
        string: string
        boolean: boolean
        bigint: bigint
        bigintObj: BigInt
        date: Date
        dateTime: DateTime
        time: Time
        float: Float
        object: { id: number; name: string }
      }
    }
    "POST /post-body": {
      body: {
        number: number
        string: string
        boolean: boolean
        bigint: bigint
        bigintObj: BigInt
        date: Date
        dateTime: DateTime
        time: Time
        float: Float
        object: { id: number; name: string }
      }
      return: {
        number: number
        string: string
        boolean: boolean
        bigint: bigint
        bigintObj: BigInt
        date: Date
        dateTime: DateTime
        time: Time
        float: Float
        object: { id: number; name: string }
      }
    }
  }
  context: {
    appPubSub: RedisPubSub
  }
}>()
