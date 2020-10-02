import { GatewayApp } from "../app"
import { PostFetcher } from "../fetcher"

/**
 * Resolver for a Category model.
 */
export const CategoryModelResolver = GatewayApp.resolver(
  GatewayApp.model("Category"),
  {
    async posts(category) {
      const { data } = await PostFetcher.query("posts")
        .add("posts")
        .posts({ take: 100, skip: 0, categoryId: category.id })
        .select({
          id: true,
          title: true,
          text: true,
          status: true,
          categoryId: true,
        })
        .fetch()

      return data.posts
    },
  },
)
