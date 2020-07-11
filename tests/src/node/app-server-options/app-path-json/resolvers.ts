import { resolver } from "@microframework/core"
import { App } from "./app"

export const PostActionResolver = resolver(App, "get /posts", () => {
  return [
    {
      id: 1,
      title: "Hello",
    },
  ]
})
