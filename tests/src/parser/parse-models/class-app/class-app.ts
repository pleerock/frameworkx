import { createApp } from "@microframework/core"

export const App = createApp<{
  models: {
    UserClass: UserClass
  }
}>()

class UserClass {
  id!: number
  name!: string
}
