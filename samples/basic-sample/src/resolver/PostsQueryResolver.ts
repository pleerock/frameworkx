import {app} from "../app";
import {PostRepository} from "../repository/PostRepository";

export const PostsQueryResolver = app
    .query("posts")
    .resolve(() => {
        return PostRepository.findAllPosts()
    })
