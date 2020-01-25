import {getRepository, Like} from "typeorm";
import {app} from "../app";
import {CategoryType} from "../model/Category";
import {PostType} from "../model/Post";
import {UserType} from "../model/User";
import {CategoryRepository} from "../repository/CategoryRepository";
import {PostRepository} from "../repository/PostRepository";
import {UserRepository} from "../repository/UserRepository";

export const SearchTypeResolver = app
    .query("search")
    .resolve(async ({ keyword }) => {
        const categories = await CategoryRepository.find({
            name: Like(`%${keyword}%`)
        })
        const users = await UserRepository.find({
            firstName: Like(`%${keyword}%`)
        })
        const posts = await PostRepository.find({
            title: Like(`%${keyword}%`)
        })
        return [
            ...categories.map(obj => ({ __typename: "CategoryType", ...obj })),
            ...users.map(obj => ({ __typename: "UserType", ...obj })),
            ...posts.map(obj => ({ __typename: "PostType", ...obj })),
        ]
    })
