import { createApp } from "@microframework/core"
import { OrganizationType, PostType, UserType } from "./models"

export const App = createApp<{
  models: {
    PostType: PostType
    UserType: UserType
    OrganizationType: OrganizationType
  }
  queries: {
    post(args: { id: number }): PostType
  }
  inputs: {}
  mutations: {}
  subscriptions: {}
  actions: {}
  context: {}
}>()
