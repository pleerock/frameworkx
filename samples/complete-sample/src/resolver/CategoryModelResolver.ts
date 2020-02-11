import { resolver } from "@microframework/core"
import { App } from "../app/App"
import { AppModels } from "../app/AppModels"
import { PostRepository } from "../repository"

/**
 * Resolver for Category model.
 */
export const CategoryModelResolver = resolver(App, { model: AppModels.Category, dataLoader: true }, {
  postsCount(categories, { logger }) {
    logger.log("I'm resolving a postsCount property using data loader!")
    return Promise.all(categories.map(category => {
      return PostRepository.count({
        categories: {
          id: category.id
        }
      })
    }))
  },
})
