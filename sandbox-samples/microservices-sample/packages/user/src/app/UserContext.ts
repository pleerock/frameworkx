import { UserApp } from "./UserApp"

/**
 * Main application context.
 */
export const UserContext = UserApp.contextResolver({
  async currentUser() {
    // normally, here you would take Authorization header from a request
    // and return user data based on a token
    return {
      id: 1,
      fullName: "Nature's Prophet",
    }
  },
})
