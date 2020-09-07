import { App } from "../app/App"
import { PostStatus } from "../enum"

/**
 * Resolver for Post model.
 */
export const PostModelResolver = App.resolver(App.model("Post"), {
  status(post, { logger }) {
    logger.log("I'm resolving a status property!")
    return PostStatus.under_moderation
  },
})
