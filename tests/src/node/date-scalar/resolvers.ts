import { resolver } from "@microframework/core"
import { App } from "./app"

export const PostResolver = resolver(App, "post", ({ id }) => {
  return {
    id,
    title: "Hello",
    lastDate: new Date(),
    lastTime: new Date(),
    createdAt: new Date(),
  }
})

export const PostCreateResolver = resolver(App, "postCreate", (post) => {
  return {
    id: 1,
    title: post.title,
    lastDate: post.date,
    lastTime: post.date,
    createdAt: post.date,
  }
})
