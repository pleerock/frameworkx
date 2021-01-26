import { createFetcher } from "@microframework/fetcher"
import { App } from "@monorepo-test/common"

export const fetcher = createFetcher(App, {
  actionEndpoint: `http://localhost:4000`,
  graphqlEndpoint: `http://localhost:4000/graphql`,
  websocketEndpoint: `ws://localhost:5000/subscriptions`,
})
