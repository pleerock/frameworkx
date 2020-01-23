import * as typeorm from "typeorm"
import {app} from "@microframework/client-server-sample-common";

export const PostRepository = app
    .model("PostType")
    .repository(repository => ({
        findAllPosts() {
            return repository.find()
        }
    }))
