import { resolver } from "@microframework/core"
import { App } from "../app"

export const PostObjectModelResolver = resolver(App, "PostType", {
  status() {
    return "draft"
  },
})
