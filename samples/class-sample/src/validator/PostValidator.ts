import { validator } from "@microframework/core"
import { Post } from "../model/Post"

export const PostValidator = validator<Post>("PostInput", {
  // title(value, post, context) {
  //
  //   // only current post's author can change post name
  //   if (context.currentUser.id === post.author.id) {
  //     return value
  //   }
  //
  //   return undefined
  // },
  text: {
    minLength: 10,
    maxLength: 10000,
  },
})
