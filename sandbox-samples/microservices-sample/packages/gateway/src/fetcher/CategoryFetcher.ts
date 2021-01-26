import { createFetcher } from "@microframework/fetcher"
import { CategoryApp } from "@microservices-test/category"

export const CategoryFetcher = createFetcher(CategoryApp, {
  actionEndpoint: `http://category:4001`,
  graphqlEndpoint: `http://category:4001/graphql`,
  // websocketEndpoint: `ws://localhost:4002/subscriptions`,
})
