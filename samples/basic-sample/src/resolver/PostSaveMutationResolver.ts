import {app} from "../app";
import {PubSubImpl} from "../index";
import {PostRepository} from "../repository/PostRepository";

export const PostSaveMutationResolver = app
    .mutation("postSave")
    .resolve(async (args, context) => {

        const post = await PostRepository.save({
            title: args.title,
            text: args.text,
            author: {
                id: context.currentUser.id
            }
        })
        await PubSubImpl.publish("POST_ADDED", post)

        return post
    })
