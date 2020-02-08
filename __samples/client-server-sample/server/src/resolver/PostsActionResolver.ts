import {app} from "@microframework/client-server-sample-common";

export const PostsActionResolver = app
    .action("GET /posts")
    .resolve(() => {
        return [
            {
                id: 1,
                title: "Post #1",
                text: "About post #1",
                active: false,
                author: {
                    id: 1,
                    firstName: "Dima",
                    lastName: "Zotov"
                },
                categories: []
            }
        ]
    })
