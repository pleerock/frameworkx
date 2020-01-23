import * as typeorm from "typeorm"
import {app} from "../app";

export const PostRepository = app
    .model("PostType")
    .repository(repository => ({
        findAllPosts() {
            return repository.find()
        }
    }))
