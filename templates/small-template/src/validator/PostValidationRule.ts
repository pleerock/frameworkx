import { App } from "../app/App"

/**
 * Validates a Post model.
 */
export const PostValidationRule = App.validationRule(App.model("Post"), {
  projection: {
    title: {
      minLength: 10,
      maxLength: 100,
    },
  },
})
