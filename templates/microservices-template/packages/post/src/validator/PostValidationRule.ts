import { PostApp } from "../app"

/**
 * Validates a Post model.
 */
export const PostValidationRule = PostApp.validationRule(
  PostApp.model("Post"),
  {
    projection: {
      title: {
        minLength: 10,
        maxLength: 100,
      },
    },
  },
)
