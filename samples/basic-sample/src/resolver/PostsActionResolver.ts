import {app} from "../app";
import {PostRepository} from "../repository/PostRepository";

export const PostsActionResolver = app
    .action("GET /posts")
    .resolve(() => {
        return PostRepository.find()
    })
