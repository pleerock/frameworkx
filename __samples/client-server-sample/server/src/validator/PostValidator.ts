import {app} from "@microframework/client-server-sample-common";

export const PostValidator = app
  .input("PostInput")
  .validator({
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
