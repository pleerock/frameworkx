import {ApplicationOptionsOf, SelectionOf} from "@microframework/core"
import {PostFilterInput} from "./input/PostFilterInput";
import {PostSaveInput} from "./input/PostSaveInput";
import {PostModel} from "./model/Post";
import {User, UserModel} from "./model/User";
import {PostWithAuthor} from "./selection/PostWithAuthor";

export type App = ApplicationOptionsOf<{
  actions: {
    "/users": {
      type: "get",
    }
  },
  queries: {
    posts(args: PostFilterInput): PostModel[],
    post(args: { id: number }): PostModel,
    user(): UserModel,
  },
  mutations: {
    savePost(args: PostSaveInput): PostModel,
    deletePost(args: { id: number }): PostModel,
  },
  selections: {
    postWithAuthor: SelectionOf<PostModel, PostWithAuthor>,
    simpleUser: SelectionOf<UserModel, { id: number }>,
  },
  models: [PostModel, UserModel],
  inputs: [PostFilterInput, PostSaveInput],
  context: {
    currentUser: User
  },
}>
