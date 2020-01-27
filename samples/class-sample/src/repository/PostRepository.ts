import * as typeorm from "typeorm"
import { AppConnection } from "../app/AppConnection"
import { Post } from "../model/Post"

export const PostRepository = AppConnection.getRepository<Post>(
  "PostType",
).extend({
  findAllPosts() {
    return this.find()
  },
})
