import { DeclarationResolver } from "@microframework/core"
import { App } from "../app"

export const PostObjectRawDeclarationResolver: DeclarationResolver<typeof App> = {

    post({ id }) {
        return { id, title: "Post #" + id }
    },

    posts() {
        return [
            { id: 1, title: "Post #1" },
            { id: 2, title: "Post #2" },
        ]
    }

}

