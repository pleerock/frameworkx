import { resolver } from "@microframework/core"
import { App } from "../app/App"
import { AppModels } from "../app/AppModels"
import { PostStatus } from "../enum"

/**
 * Resolver for Post model.
 */
export const PostTypeResolver = resolver(App, AppModels.Post, {
  status() {
    return PostStatus.under_moderation
  },
})
