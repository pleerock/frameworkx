import { In } from "typeorm"
import { App, AppPubSub } from "../app"
import { PostFilterInput, PostSaveInput } from "../input"
import { CategoryRepository, PostRepository } from "../repository"

/**
 * Resolver for post declarations.
 */
export const PostDeclarationResolver = App.resolver({
  async posts(input: PostFilterInput) {
    return PostRepository.findAllPosts(input.skip, input.take)
  },

  async postRemove({ id }: { id: number }) {
    const post = await PostRepository.findOneBy({ id })
    if (!post) return false
    await PostRepository.remove(post)
    return true
  },

  async postSave(input: PostSaveInput) {
    const post = await PostRepository.save({
      id: input.id || undefined,
      title: input.title,
      text: input.text,
    })

    if (input.categoryIds) {
      const categories = await CategoryRepository.findBy({
        id: In(input.categoryIds),
      })
      await PostRepository.save({
        id: post.id,
        categories,
      })
    }

    if (!input.id) {
      await AppPubSub.publish("POST_CREATED", post)
    }
    return post
  },

  postCreated: {
    triggers: ["POST_CREATED"],
  },
})
