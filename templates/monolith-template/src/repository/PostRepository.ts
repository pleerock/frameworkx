import { App, AppDataSource } from "../app"

/**
 * Used to perform Post-entity database queries.
 * This repository contains custom repository methods.
 */
export const PostRepository = AppDataSource.getRepository(
  App.model("Post"),
).extend({
  /**
   * Takes all posts starting from a given "skip" and taking given "take" number of posts.
   */
  findAllPosts(skip: number, take: number) {
    return this.find({ take, skip })
  },
})
