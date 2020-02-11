import { validationRule } from "@microframework/core"
import { AppModels } from "../app/AppModels"

/**
 * Validates Post model.
 */
export const PostValidationRule = validationRule(AppModels.Post, {
  projection: {
    text: {
      minLength: 10,
      maxLength: 10000,
    },
  },
  // validate: post => {
  // }
})
