import { repository } from "typeorm"
import * as typeorm from "typeorm"
import { PostType } from "../model/Post"

export const PostRepository = repository<PostType>("PostType").extend(
  repository => ({
    findAllPosts() {
      return repository.find()
    },
  }),
)
