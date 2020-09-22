import { App } from "../app/App"
import { PostRepository } from "../repository"

/**
 * Resolver for Category model.
 * This resolver provides a demonstration on how to use a data-loader pattern.
 */
export const CategoryModelResolver = App.resolver(
  { model: App.model("Category"), dataLoader: true },
  {
    postsCount(categories, { logger }) {
      logger.log("I'm resolving a postsCount property using data loader!")
      return Promise.all(
        categories.map((category) => {
          return PostRepository.count({
            categories: {
              id: category.id,
            },
          })
        }),
      )
    },
  },
)
