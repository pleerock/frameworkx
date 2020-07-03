import { resolver } from "@microframework/core"
import { App } from "./app"

export const PostResolver = resolver(App, "post", ({ id }) => {
  if (id === 1) {
    return {
      id,
      title: "Some title",
      status: "PUBLISHED",
    }
  } else {
    return {
      id,
      title: "Some title",
      status: "DRAFT",
    }
  }
})

export const PostCreateResolver = resolver(
  App,
  "postCreate",
  ({ title, status }) => {
    return {
      id: 1,
      title,
      status,
    }
  },
)
