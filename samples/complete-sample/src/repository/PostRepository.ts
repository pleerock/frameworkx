import { App, AppConnection } from "../app"

/**
 * Used to perform Post-entity database requests.
 */
export const PostRepository = AppConnection.getRepository(
  App.model("Post"),
).extend({
  findAllPosts(offset: number, limit: number) {
    return this.find({ take: limit, skip: offset })
  },
})
