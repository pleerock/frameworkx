import { resolver } from "@microframework/core"
import { PostApp } from "../app";

/**
 * "post" query resolver.
 */
export const PostResolver = resolver(PostApp, "post", () => {
  return {

  }
})
