import { GatewayApp } from "../app"
import { CategoryFetcher } from "../fetcher"

/**
 * Resolver for a Post model.
 */
export const PostModelResolver = GatewayApp.resolver(GatewayApp.model("Post"), {
  async category(post) {
    if (!post.categoryId) return null
    const { data } = await CategoryFetcher.query("category")
      .add("category")
      .category({ id: post.categoryId })
      .select({
        id: true,
        name: true,
      })
      .fetch()

    return data.category
  },
})
