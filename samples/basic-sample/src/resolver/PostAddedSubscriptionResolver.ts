import {app} from "../app";

export const PostAddedSubscriptionResolver = app
    .subscription("postAdded")
    .resolve({
        triggers: ["POST_ADDED"]
    })
