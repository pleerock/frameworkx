import { App } from "../app"
import { PostRepository } from "../repository"

/**
 * Resolver for Category model.
 */
export const CategoryModelResolver = App.resolver(
  { model: App.model("Category"), dataLoader: true },
  {
    postsCount(categories, { logger }) {
      logger.log("I'm resolving a postsCount property using data loader!")
      return Promise.all(
        categories.map((category) => {
          return PostRepository.countBy({
            categories: {
              id: category.id,
            },
          })
        }),
      )
    },
  },
)
