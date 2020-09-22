import { App } from "../app/App"

/**
 * Resolver for Post model.
 */
export const PostModelResolver = App.resolver(App.model("Post"), {
  status(post, { logger }) {
    logger.log("I'm resolving a status property!")
    return "under_moderation"
  },
})
