import { PostApp } from "../app"

/**
 * Resolver for "postCreated" subscription.
 */
export const PostCreatedSubscriptionResolver = PostApp.resolver("postCreated", {
  triggers: ["POST_CREATED"],
})
