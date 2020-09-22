import { App } from "./App"

/**
 * Main application context.
 */
export const AppContext = App.contextResolver({
  async currentUser() {
    // normally, here you would take Authorization header from a request
    // and return user data based on a token
    return {
      id: 1,
      fullName: "Nature's Prophet",
    }
  },
})
