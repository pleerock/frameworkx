import { UserApp } from "../app"
import { UserRepository } from "../repository"

/**
 * Resolver for "users" query.
 */
export const UsersQueryResolver = UserApp.resolver("users", () => {
  return UserRepository.find()
})
