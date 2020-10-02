import { Fetcher } from "@microframework/fetcher"
import { UserApp } from "microframework-template-microservices-user"

export const UserFetcher = new Fetcher(UserApp, {
  actionEndpoint: `http://user:4002`,
  graphqlEndpoint: `http://user:4002/graphql`,
  // websocketEndpoint: `ws://localhost:4002/subscriptions`,
})
