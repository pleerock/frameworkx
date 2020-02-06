import { DeclarationResolver } from "@microframework/core"
import { Like } from "typeorm"
import { SearchDeclaration } from "../declaration"
import { Category, Post, SearchType, User } from "../model"
import {
  CategoryRepository,
  PostRepository,
  UserRepository,
} from "../repository"
import { App } from "../app/App"

export class SearchDeclarationResolver implements DeclarationResolver<typeof App> {
  async search({ keyword }: { keyword: string }): Promise<SearchType[]> {
    const categories = await CategoryRepository.find({
      name: Like(`%${keyword}%`),
    })
    const users = await UserRepository.find({
      firstName: Like(`%${keyword}%`),
    })
    const posts = await PostRepository.find({
      title: Like(`%${keyword}%`),
    })
    return [
      ...categories.map(obj => ({ __typename: "Category", ...obj })),
      ...users.map(obj => ({ __typename: "User", ...obj })),
      ...posts.map(obj => ({ __typename: "Post", ...obj })),
    ]
  }
}
