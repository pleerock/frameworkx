import {
  mutation,
  query,
  request,
  RequestReturnType,
} from "@microframework/core"
import { App } from "../app/App"

export const PostListRequest = request("PostList", {
  myPosts: query(App, "posts", {
    input: {
      limit: 1,
      offset: 0,
    },
    select: {
      id: true,
    },
  }),
  firstCategory: query(App, "category", {
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
  currentUser: query(App, "currentUser", {
    select: {
      id: true,
    },
  }),
  removePost: mutation(App, "postRemove", {
    input: {
      id: 1,
    },
  }),
})

export type PostListQueryType = RequestReturnType<
  typeof PostListRequest,
  "firstCategory"
>
const post: PostListQueryType = {
  id: 1,
  posts: [{ id: 1 }],
}
// export const PostListQueryType = QueryReturnType<typeof PostListQuery, "myPosts">
// select: staticType({ ... }) dunno
