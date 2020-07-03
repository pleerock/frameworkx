import { resolver } from "@microframework/core"
import { App } from "./app"

export const PostResolver = resolver(App, "post", ({ id }) => {
  const date = new Date(2020, 6, 1, 6, 0, 0, 0)
  return {
    id,
    title: "Hello",
    lastDate: date,
    lastTime: date,
    createdAt: date,
  }
})

export const PostCreateResolver = resolver(App, "postCreate", (post) => {
  return {
    id: 1,
    title: post.title,
    lastDate: post.lastDate,
    lastTime: post.lastTime,
    createdAt: post.createdAt,
  }
})
