import { validator } from "@microframework/core"
import { Post } from "../model"

export const PostValidator = validator<Post>("PostInput", {
  text: {
    minLength: 10,
    maxLength: 10000,
  },
})
