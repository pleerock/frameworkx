import { Like } from "typeorm"
import { App } from "../app"
import { SearchType } from "../model"
import {
  CategoryRepository,
  PostRepository,
  UserRepository,
} from "../repository"

/**
 * Resolver for search declarations.
 */
export const SearchDeclarationResolver = App.resolver({
  async search({ keyword }): Promise<SearchType[]> {
    const categories = await CategoryRepository.findBy({
      name: Like(`%${keyword}%`),
    })
    const users = await UserRepository.findBy({
      firstName: Like(`%${keyword}%`),
    })
    const posts = await PostRepository.findBy({
      title: Like(`%${keyword}%`),
    })
    return [...categories, ...users, ...posts]
  },
})
