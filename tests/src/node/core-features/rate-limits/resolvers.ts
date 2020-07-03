import { resolver } from "@microframework/core"
import { App } from "./app"

export const PostResolver = resolver(App, "post", ({ id }) => {
  return {
    id,
    title: "Hello",
  }
})

export const PostSaveResolver = resolver(App, "postSave", ({ id }) => {
  return true
})

export const PostActionResolver = resolver(App, "get /posts", () => {
  return [
    {
      id: 1,
      title: "Hello",
      status: "draft",
    },
  ]
})

export const PostTypeResolver = resolver(App, "PostType", {
  status() {
    return "draft"
  },
})
