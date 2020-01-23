import {app} from "../app";
import {Status} from "../enum/Status";

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
                lastName: "Zotov",
                fullName: "Dima Zotov",
                status: Status.active,
                activation: "activated",
            },
            categories: []
        }
    })
