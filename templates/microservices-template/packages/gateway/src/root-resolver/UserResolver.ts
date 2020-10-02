import { GatewayApp } from "../app"
import { UserFetcher } from "../fetcher"

/**
 * Resolvers for User module.
 */
export const UserResolver = GatewayApp.resolver({
  async users() {
    const { data } = await UserFetcher.query("users")
      .add("users")
      .users()
      .select({
        id: true,
        firstName: true,
        lastName: true,
      })
      .fetch()

    return data.users
  },
  async userRegister(input) {
    const { data } = await UserFetcher.mutation("userRegister")
      .add("user")
      .userRegister({
        firstName: input.firstName,
        lastName: input.lastName,
        plainPassword: input.plainPassword,
      })
      .select({
        id: true,
        firstName: true,
        lastName: true,
      })
      .fetch()

    return data.user
  },
})
