import { PostApp } from "../app"
import { PostRepository } from "../repository"

/**
 * Resolver for "posts" query.
 */
export const PostsQueryResolver = PostApp.resolver("posts", (input) => {
  return PostRepository.findAllPosts({
    take: input.take,
    skip: input.skip,
    categoryId: input.categoryId,
  })
})
