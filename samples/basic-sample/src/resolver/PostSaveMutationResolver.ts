import {app} from "../app";
import {PubSubImpl} from "../index";

export const PostSaveMutationResolver = app
    .mutation("postSave")
    .resolve(async (args, context) => {

        const post = await app.model("PostType").entity().repository.save({
            title: args.title,
            text: args.text,
            author: {
                id: context.currentUser.id
            }
        })

        await PubSubImpl.publish("POST_ADDED", post)

        return post
    })
