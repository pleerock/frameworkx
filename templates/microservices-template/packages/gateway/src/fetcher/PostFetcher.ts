import { Fetcher } from "@microframework/fetcher"
import { PostApp } from "microframework-template-microservices-post"

export const PostFetcher = new Fetcher(PostApp, {
  actionEndpoint: `http://post:4002`,
  graphqlEndpoint: `http://post:4002/graphql`,
  // websocketEndpoint: `ws://localhost:4002/subscriptions`,
})
