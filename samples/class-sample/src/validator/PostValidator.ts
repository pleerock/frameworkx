import { validationRule } from "@microframework/core"
import { AppModels } from "../app/AppModels";

export const PostValidator = validationRule(AppModels.Post, {
  projection: {
    text: {
      minLength: 10,
      maxLength: 10000,
    },
  },
  // validate: post => {
  // }
})
