import { contextResolver } from "@microframework/core"
import { App } from "../app"

export const PostContextResolver = contextResolver(App, {
  sessionPost() {
    return {
      id: 0,
      title: "I am Session Post resolved by a context",
      status: "published" as const,
    }
  },
})
