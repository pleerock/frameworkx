import {getRepository} from "typeorm";
import {app} from "../app";
import {UserType} from "../model/User";

export const PostTypeResolver = app
    .model("PostType")
    .resolve({
        active() {
            return true
        },
        async userOrCategory(post) {
            return {
                __typename: "UserType",
                ...await getRepository<UserType>("UserType").findOneOrFail(1),
            }
        }
    })
