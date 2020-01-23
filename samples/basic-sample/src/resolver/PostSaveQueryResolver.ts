import {app} from "../app";

export const PostSaveQueryResolver = app
    .mutation("postSave")
    .resolve((args, context) => {
        return app.model("PostType").entity().repository.save({
            title: args.title,
            text: args.text,
            author: {
                id: context.currentUser.id
            }
        })
    })
