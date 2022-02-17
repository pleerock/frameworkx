import { UserRepository } from "../repository"
import { App } from "./App"

/**
 * Main application context.
 */
export const AppContext = App.contextResolver({
  async currentUser() {
    const user = await UserRepository.findOneBy({ id: 1 })
    if (!user) return { id: 0 }

    return {
      id: user.id,
    }
  },
})
