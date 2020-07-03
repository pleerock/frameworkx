import { resolver } from "@microframework/core"
import { App } from "./app"

export const PostResolver = resolver(App, "post", ({ id }) => {
  return {
    id,
    views: 0,
    title: "About ORM",
    published: false,
    coefficient: 1.5,
    tags: ["orm", "database", "rdbms"],
    counters: [1, 2, 3],
    coefficients: [1.1, 2.2, 3.3],
  }
})

export const PostCreateResolver = resolver(App, "postCreate", (post) => {
  return {
    id: 1,
    views: post.views,
    title: post.title,
    published: post.published,
    tags: post.tags,
    coefficient: post.coefficient,
    counters: post.counters,
    coefficients: post.coefficients,
  }
})
