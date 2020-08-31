import { resolver } from "@microframework/core"
import { App } from "./app"
import { PostType } from "./models"
import { CategoryList, PostList } from "./repositories"

export const PostResolver = resolver(App, {
  postRandomOne() {
    return PostList[0]
  },
  post({ id }) {
    return PostList.find((post) => post.id === id) || null
  },
  posts() {
    return [...PostList]
  },
  postsSearch(input) {
    return [...PostList]
      .filter((post) => input.filter.ids.indexOf(post.id) !== -1)
      .slice(input.filter.skip, input.filter.take)
  },
  async postCreate(input, { appPubSub }) {
    const post: PostType = {
      id: 1,
      title: input.title,
      categories: [],
      primaryCategory: CategoryList[0],
      secondaryCategory: null,
      active: true,
      likes: 0,
      createdAt: new Date(),
    }
    await appPubSub.publish("POST_CREATED", post)
    return post
  },
  postRemove() {
    return true
  },
  postRemoveAll() {
    return true
  },
  postCreated: {
    triggers: ["POST_CREATED"],
  },
})
