import {DeclarationResolver} from "@microframework/core/_";
import {Like} from "typeorm";
import {SearchDeclaration} from "../declaration/SearchDeclaration";
import {CategoryType} from "../model/Category";
import {PostType} from "../model/Post";
import {SearchType} from "../model/Search";
import {UserType} from "../model/User";
import {CategoryRepository} from "../repository/CategoryRepository";
import {PostRepository} from "../repository/PostRepository";
import {UserRepository} from "../repository/UserRepository";

export class SearchDeclarationResolver implements DeclarationResolver<SearchDeclaration> {

    async search({ keyword }: { keyword: string }): Promise<SearchType[]> {
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
    }

}
