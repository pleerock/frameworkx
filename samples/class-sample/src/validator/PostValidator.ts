import {validator} from "@microframework/core";
import {PostType} from "../model/Post";

export const PostValidator = validator<PostType>("PostInput", {
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
      maxLength: 10000
    }
  })
