import {getRepository} from "typeorm";
import {app} from "../app";
import {CategoryType} from "../model/Category";
import {PostType} from "../model/Post";
import {UserType} from "../model/User";

export const SearchTypeResolver = app
    .query("search")
    .resolve(async () => {
        return [
            ...(await getRepository<CategoryType>("CategoryType").find()).map(obj => ({ __typename: "CategoryType", ...obj })),
            ...(await getRepository<UserType>("UserType").find()).map(obj => ({ __typename: "UserType", ...obj })),
            ...(await getRepository<PostType>("PostType").find()).map(obj => ({ __typename: "PostType", ...obj })),
        ]
    })
