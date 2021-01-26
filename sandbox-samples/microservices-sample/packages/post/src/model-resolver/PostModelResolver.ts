import { PostApp } from "../app"

/**
 * Resolver for Post model.
 */
export const PostModelResolver = PostApp.resolver(PostApp.model("Post"), {
  status(post, { logger }) {
    logger.log("I'm resolving a status property!")
    return "under_moderation"
  },
})
