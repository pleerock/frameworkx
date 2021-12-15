import { RequestReturnType } from "@microframework/core"
import { App } from "../app"

export const PostListRequest = App.requestFn("PostList", {
  myPosts: App.query("posts", {
    input: {
      limit: 1,
      offset: 0,
    },
    select: {
      id: true,
      createdAt: true,
    },
  }),
  firstCategory: App.query("category", {
    input: {
      id: 1,
    },
    select: {
      id: true,
      posts: {
        id: true,
      },
    },
  }),
  currentUser: App.query("currentUser", {
    select: {
      id: true,
    },
  }),
})

export type PostListType = RequestReturnType<typeof PostListRequest, "myPosts">
