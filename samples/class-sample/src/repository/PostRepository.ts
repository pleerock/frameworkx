import * as typeorm from "typeorm"
import { AppConnection } from "../app/AppConnection"
import { Post } from "../model"

export const PostRepository = AppConnection.getRepository<Post>("Post").extend({
  findAllPosts() {
    return this.find()
  },
})
