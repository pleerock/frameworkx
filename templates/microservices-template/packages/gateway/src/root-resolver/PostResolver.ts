import { GatewayApp } from "../app"
import { PostFetcher } from "../fetcher"

/**
 * Resolvers for Post module.
 */
export const PostResolver = GatewayApp.resolver({
  async posts() {
    const { data } = await PostFetcher.query("posts")
      .add("posts")
      .posts({ take: 100, skip: 0 })
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
  async postSave(input) {
    const { data } = await PostFetcher.mutation("postSave")
      .add("post")
      .postSave({
        id: input.id,
        title: input.title,
        text: input.text,
        categoryId: input.categoryId,
      })
      .select({
        id: true,
        title: true,
        text: true,
        status: true,
        categoryId: true,
      })
      .fetch()

    return data.post
  },
  async postRemove({ id }) {
    const { data } = await PostFetcher.mutation("postRemove")
      .add("post")
      .postRemove({ id })
      .fetch()

    return data.post
  },
})
