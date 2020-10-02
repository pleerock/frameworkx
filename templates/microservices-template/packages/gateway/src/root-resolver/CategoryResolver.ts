import { GatewayApp } from "../app"
import { CategoryFetcher } from "../fetcher"

/**
 * Resolvers for Category module.
 */
export const CategoryResolver = GatewayApp.resolver({
  async category({ id }) {
    const { data } = await CategoryFetcher.query("category")
      .add("category")
      .category({ id })
      .select({
        id: true,
        name: true,
      })
      .fetch()

    return data.category
  },
  async categorySave(input) {
    const { data } = await CategoryFetcher.mutation("categorySave")
      .add("category")
      .categorySave({
        id: input.id,
        name: input.name,
      })
      .select({
        id: true,
        name: true,
      })
      .fetch()

    return data.category
  },
  async categoryRemove({ id }) {
    const { data } = await CategoryFetcher.mutation("categoryRemove")
      .add("category")
      .categoryRemove({ id })
      .fetch()

    return data.category
  },
})
