import { resolver } from "@microframework/core"
import { App } from "../app"

export const PostDeclarationWithContextResolver = resolver(App, {

    postFromSession(context) {
        return context.sessionPost
    }

})
