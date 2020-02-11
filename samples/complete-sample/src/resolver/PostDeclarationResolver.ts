import { resolver } from "@microframework/core"
import { App } from "../app/App"
import { PostFilterInput, PostInput } from "../input"
import { Post } from "../model"
import { PostRepository } from "../repository"

/**
 * Resolver for post declarations.
 */
export const PostDeclarationResolver = resolver(App, {
  async posts(args: PostFilterInput, { logger }): Promise<Post[]> {
    return PostRepository.findAllPosts(args.offset, args.limit)
  },

  async postRemove(args: { id: number }): Promise<boolean> {
    const post = await PostRepository.findOneOrFail(args.id)
    await PostRepository.remove(post)
    return true
  },

  postSave(args: PostInput): Promise<Post> {
    return PostRepository.save({
      id: args.id || undefined,
      title: args.title,
      text: args.text,
    })
  },
})
