import * as typeorm from "typeorm"
import { AppConnection } from "../app/AppConnection"
import { PostType } from "../model/Post"

export const PostRepository = AppConnection.getRepository<PostType>(
  "PostType",
).extend({
  findAllPosts() {
    return this.find()
  },
})
