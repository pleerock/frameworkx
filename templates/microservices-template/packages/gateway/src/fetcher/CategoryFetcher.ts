import { Fetcher } from "@microframework/fetcher"
import { CategoryApp } from "microframework-template-microservices-category"

export const CategoryFetcher = new Fetcher(CategoryApp, {
  actionEndpoint: `http://category:4001`,
  graphqlEndpoint: `http://category:4001/graphql`,
  // websocketEndpoint: `ws://localhost:4002/subscriptions`,
})
