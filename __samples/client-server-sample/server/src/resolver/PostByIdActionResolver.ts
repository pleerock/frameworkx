import {app} from "@microframework/client-server-sample-common";

export const PostByIdActionResolver = app
    .action("GET /posts/:id")
    .resolve(({ params }) => {
        return {
            id: params.id,
            title: "Post #" + params.id,
            text: "About post #" + params.id,
            active: false,
            author: {
                id: 1,
                firstName: "Dima",
                lastName: "Zotov"
            },
            categories: []
        }
    })
