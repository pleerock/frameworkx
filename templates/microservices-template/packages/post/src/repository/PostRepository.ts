import { PostApp, PostDataSource } from "../app"

/**
 * Used to perform Post-entity database queries.
 * This repository contains custom repository methods.
 */
export const PostRepository = PostDataSource.getRepository(
  PostApp.model("Post"),
).extend({
  /**
   * Finds posts by a given criteria.
   */
  findAllPosts({
    take,
    skip,
    categoryId,
  }: {
    take?: number
    skip?: number
    categoryId?: number | null
  }) {
    return this.find({
      take,
      skip,
      where: {
        categoryId: categoryId ? categoryId : undefined,
      },
    })
  },
})
