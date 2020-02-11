import { resolver } from "@microframework/core"
import { App } from "../app"
import { PostType } from "../model/PostType"

export const PostObjectDLModelResolver = resolver(App, { name: "PostType", dataLoader: true }, () => ({
    status(posts) {
        return posts.map(_ => "draft")
    }
}))
