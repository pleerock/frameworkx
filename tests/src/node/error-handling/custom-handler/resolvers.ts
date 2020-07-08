import { resolver } from "@microframework/core"
import { App } from "./app"

export const PostResolver = resolver(App, "post", ({ id }) => {
  if (id <= 0) throw new Error(`Post id isn't valid.`)
  return {
    id,
    title: "Hello",
  }
})

export const PostsActionResolver = resolver(App, "get /posts", () => {
  throw new Error(`You have no access to this content.`)
})
