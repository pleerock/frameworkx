import { contextResolver } from "@microframework/core";
import { UserRepository } from "../repository"
import { App } from "./App";

export const AppContext = contextResolver(App, {
  async currentUser() {
    const user = await UserRepository.findOne(1)
    if (!user) return { id: 0 }

    return {
      id: user.id,
    }
  },
})
