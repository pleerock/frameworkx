import {app} from "../app";

export const PostRemovedSubscriptionResolver = app
    .subscription("postRemoved")
    .resolve({
        triggers: ["POST_REMOVED"]
    })