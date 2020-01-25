import {app} from "../app";
import {PostStatus} from "../enum/PostStatus";

export const PostByIdActionResolver = app
    .action("GET /posts/:id")
    .resolve(({ params }) => {
        return {
            id: params.id,
            title: "Post #" + params.id,
            text: "About post #" + params.id,
            status: PostStatus.moderated,
            author: {
                id: 1,
                firstName: "Timber",
                lastName: "Saw",
                fullName: "Timber Saw",
                status: "active",
            },
            categories: []
        }
    })
