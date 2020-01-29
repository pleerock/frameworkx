import * as typeorm from "typeorm"
import { PostType } from "@microframework/client-server-sample-common";
import { AppConnection } from "../connection";

export const PostRepository = AppConnection.getRepository<PostType>("PostType").extend({
    findAllPosts() {
        return this.find()
    },
})
