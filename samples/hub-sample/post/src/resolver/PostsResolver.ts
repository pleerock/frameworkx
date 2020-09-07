import { resolver } from "@microframework/core"
import { PostApp } from "../app"

/**
 * "posts" query resolver.
 */
export const PostsResolver = resolver(PostApp, "posts", ({ filter }) => {
  return []
})
