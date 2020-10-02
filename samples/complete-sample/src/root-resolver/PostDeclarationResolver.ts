import { App, AppPubSub } from "../app"
import { PostFilterInput, PostInput } from "../input"
import { Post } from "../model"
import { PostRepository } from "../repository"

/**
 * Resolver for post declarations.
 */
export const PostDeclarationResolver = App.resolver({
  async posts(args: PostFilterInput, { logger }): Promise<Post[]> {
    return PostRepository.findAllPosts(args.offset, args.limit)
  },

  async postRemove(args: { id: number }): Promise<boolean> {
    const post = await PostRepository.findOneOrFail(args.id)
    await PostRepository.remove(post)
    return true
  },

  async postSave(args: PostInput): Promise<Post> {
    const post = await PostRepository.save({
      id: args.id || undefined,
      title: args.title,
      text: args.text,
    })
    if (!args.id) {
      await AppPubSub.publish("POST_ADDED", post)
    }
    return post
  },

  postAdded: {
    triggers: ["POST_ADDED"],
  },
})
