import { UserApp, UserPubSub } from "../app"
import { UserRepository } from "../repository"
import { PasswordEncryptor } from "../util"

/**
 * Resolver for "userRegister" mutation.
 */
export const UserRegisterMutationResolver = UserApp.resolver(
  "userRegister",
  (input) => {
    return UserRepository.save({
      firstName: input.firstName,
      lastName: input.lastName,
      password: PasswordEncryptor.encrypt(input.plainPassword),
    })
  },
)
