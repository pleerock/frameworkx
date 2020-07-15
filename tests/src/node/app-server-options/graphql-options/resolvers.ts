import { resolver } from "@microframework/core"
import { App } from "./app"

export const PostResolver = resolver(App, "post", ({ id }) => {
  return {
    id,
    title: "Hello",
  }
})
