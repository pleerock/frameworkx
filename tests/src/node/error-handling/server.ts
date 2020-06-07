import { createApplicationServer } from "@microframework/node"
import { App } from "./app"
import {
    PostsActionResolver,
    PostResolver,
    PostSaveResolver,
    PostTypeResolver,
    PostsOldActionResolver, PostsNewActionResolver
} from "./resolvers";

export const AppServer = (port: number) => {
    return createApplicationServer(App, {
        appPath: __dirname + "/app",
        webserver: {
            port: port,
            cors: true,
        },
        graphql: {
            graphiql: true,
            playground: true,
        },
        resolvers: [
            PostResolver,
            PostSaveResolver,
            PostsActionResolver,
            PostsNewActionResolver,
            PostsOldActionResolver,
            PostTypeResolver,
        ],
    })
}
