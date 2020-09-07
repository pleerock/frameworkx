import { resolver } from "@microframework/core"
import { PostApp } from "../app"

/**
 * "postRemove" mutation resolver.
 */
export const PostRemoveResolver = resolver(PostApp, "postRemove", () => {
  return {}
})
