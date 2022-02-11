import { App, AppDataSource } from "../app"

/**
 * Used to perform Post-entity database requests.
 */
export const PostRepository = AppDataSource.getRepository(
  App.model("Post"),
).extend({
  findAllPosts(offset: number, limit: number) {
    return this.find({ take: limit, skip: offset })
  },
})
