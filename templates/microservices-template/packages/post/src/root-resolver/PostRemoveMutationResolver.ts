import { PostApp } from "../app"
import { PostRepository } from "../repository"

/**
 * Resolver for "postRemove" mutation.
 */
export const PostRemoveMutationResolver = PostApp.resolver(
  "postRemove",
  async ({ id }) => {
    const post = await PostRepository.findOne(id)
    if (!post) return false
    await PostRepository.remove(post)
    return true
  },
)
