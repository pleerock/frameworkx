import { UserApp } from "../app"

/**
 * Resolver for User model.
 */
export const UserModelResolver = UserApp.resolver(UserApp.model("User"), {
  // ...
})
