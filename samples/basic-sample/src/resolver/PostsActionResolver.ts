import {app} from "../app";
import {Status} from "../enum/Status";

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
                    lastName: "Zotov",
                    fullName: "Dima Zotov",
                    status: Status.active,
                    activation: "activated",
                },
                categories: [],
            }
        ]
    })
