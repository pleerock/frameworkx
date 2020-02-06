import * as typeorm from "typeorm"
import { AppConnection } from "../app/AppConnection"
import { AppModels } from "../app/AppModels";

export const PostRepository = AppConnection
    .getRepository(AppModels.Post)
    .extend({
      findAllPosts() {
        return this.find()
      },
    })
