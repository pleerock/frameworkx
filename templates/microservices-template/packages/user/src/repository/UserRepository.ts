import { UserApp, UserDbConnection } from "../app"

/**
 * Used to perform User-entity database queries.
 * This repository contains custom repository methods.
 */
export const UserRepository = UserDbConnection.getRepository(
  UserApp.model("User"),
).extend({
  // ... custom repository methods
})
