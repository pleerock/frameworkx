import { createFetcher } from "@microframework/fetcher"
import { UserApp } from "@microservices-test/user"

export const UserFetcher = createFetcher(UserApp, {
  actionEndpoint: `http://user:4002`,
  graphqlEndpoint: `http://user:4002/graphql`,
  // websocketEndpoint: `ws://localhost:4002/subscriptions`,
})
