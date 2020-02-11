import { resolver } from "@microframework/core"
import { App } from "../app/App"
import { AppModels } from "../app/AppModels"
import { PostStatus } from "../enum"

/**
 * Resolver for Post model.
 */
export const PostModelResolver = resolver(App, AppModels.Post, {
  status(post, { logger }) {
    logger.log("I'm resolving a status property!")
    return PostStatus.under_moderation
  },
})
