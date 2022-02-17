import { PostApp } from "../app"
import { PostRepository } from "../repository"

/**
 * Resolver for "postRemove" mutation.
 */
export const PostRemoveMutationResolver = PostApp.resolver(
  "postRemove",
  async ({ id }) => {
    const post = await PostRepository.findOneBy({ id })
    if (!post) return false
    await PostRepository.remove(post)
    return true
  },
)
