import { UserRepository } from "../repository"

export const Context = {
  currentUser: async () => {
    const user = await UserRepository.findOne(1)
    if (!user) return { id: 0 }

    return {
      id: user.id,
    }
  },
}
