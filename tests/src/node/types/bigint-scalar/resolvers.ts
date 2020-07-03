import { resolver } from "@microframework/core"
import { App } from "./app"

export const PostResolver = resolver(App, "post", ({ id }) => {
  return {
    id,
    title: "Hello",
    views: BigInt("9007199254740991"),
    likes: BigInt("1234567890"),
  }
})

export const PostCreateResolver = resolver(App, "postCreate", (post) => {
  return {
    id: 1,
    title: post.title,
    views: post.views * BigInt(2),
    likes: BigInt("1234567890") - BigInt("0"),
  }
})
