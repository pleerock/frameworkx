import {app} from "@microframework/client-server-sample-common";

export const PostTypeResolver = app
    .model("PostType")
    .resolve({
        active() {
            return true
        },
    })
