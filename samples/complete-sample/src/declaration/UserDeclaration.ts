import { User } from "../model"

/**
 * Declarations for User.
 */
export type UserDeclaration = {
  models: {
    User: User
  }
  queries: {
    /**
     * Returns currently authenticated user.
     */
    currentUser(): User
  }
}
