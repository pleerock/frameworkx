import { resolver } from "@microframework/core"
import { Like } from "typeorm"
import { App } from "../app/App"
import { SearchType } from "../model"
import { CategoryRepository, PostRepository, UserRepository, } from "../repository"

/**
 * Resolver for search declarations.
 */
export const SearchDeclarationResolver = resolver(App, {
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
      ...categories,
      ...users,
      ...posts,
    ]
  },
})
