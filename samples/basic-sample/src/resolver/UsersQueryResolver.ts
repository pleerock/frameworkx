import {app} from "../app";
import {Status} from "../enum/Status";

export const UsersQueryResolver = app
    .query("users")
    .resolve(({ status }) => {
        return []
    })
