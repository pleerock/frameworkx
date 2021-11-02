import { createApp } from "@microframework/core"
import { User } from "../model"
import { UserRegisterInput } from "../input"

/**
 * Main application declarations file.
 */
export const UserApp = createApp<{
  models: {
    User: User
  }

  inputs: {
    UserRegisterInput: UserRegisterInput
  }

  queries: {
    /**
     * Loads all users.
     */
    users(): User[]
  }

  mutations: {
    /**
     * Registers a new user.
     */
    userRegister(input: UserRegisterInput): User
  }

  subscriptions: {}
  actions: {}
  context: {}
}>()
