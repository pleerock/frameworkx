import { PostApp, PostPubSub } from "../app"
import { PostRepository } from "../repository"

/**
 * Resolver for "postSave" mutation.
 */
export const PostSaveMutationResolver = PostApp.resolver(
  "postSave",
  async (input) => {
    const post = await PostRepository.save({
      id: input.id || undefined,
      title: input.title,
      text: input.text,
      categoryId: input.categoryId,
    })

    if (!input.id) {
      await PostPubSub.publish("POST_CREATED", post)
    }
    return post
  },
)
