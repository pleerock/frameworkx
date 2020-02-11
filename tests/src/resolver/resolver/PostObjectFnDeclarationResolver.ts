import { resolver } from "@microframework/core"
import { App } from "../app"

export const PostObjectFnDeclarationResolver = resolver(App, {

    post({ id }) {
        return { id, title: "Post #" + id }
    },

    posts() {
        return [
            { id: 1, title: "Post #1" },
            { id: 2, title: "Post #2" },
        ]
    }

})

