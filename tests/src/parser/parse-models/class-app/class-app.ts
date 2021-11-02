import { createApp } from "@microframework/core"

export const App = createApp<{
  models: {
    UserClass: UserClass
  }
  inputs: {}
  queries: {}
  mutations: {}
  subscriptions: {}
  actions: {}
  context: {}
}>()

class UserClass {
  id!: number
  name!: string
}
