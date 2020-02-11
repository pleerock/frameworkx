import { resolver } from "@microframework/core"
import { App } from "../app"

export const PostsItemFnDeclarationResolver = resolver(App, "posts", async () => {
    return [
        { id: 1, title: "Post #1" },
        { id: 2, title: "Post #2" },
    ]
})

export const PostItemFnDeclarationResolver = resolver(App, "post", async ({ id }) => {
    return  { id: id, title: "Post #" + id }
})
