import {app} from "@microframework/client-server-sample-common";
import {PostRepository} from "../repository/PostRepository";

export const PostsQueryResolver = app
    .query("posts")
    .resolve(() => {
        return PostRepository.findAllPosts()
    })
