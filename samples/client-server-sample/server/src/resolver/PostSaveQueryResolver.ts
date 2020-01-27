import {app} from "@microframework/client-server-sample-common";
import {PostRepository} from "../repository/PostRepository";

export const PostSaveQueryResolver = app
    .mutation("postSave")
    .resolve((args, context) => {
        return PostRepository.save({
            title: args.title,
            text: args.text,
            author: {
                id: context.currentUser.id
            }
        })
    })
