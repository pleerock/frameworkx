import { validator } from "@microframework/core"
import { AppModels } from "../app/AppModels";

export const PostValidator = validator(AppModels.Post, {
  text: {
    minLength: 10,
    maxLength: 10000,
  },
})
