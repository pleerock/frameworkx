import { UserApp } from "../app"
import { entity } from "@microframework/node"

/**
 * Database schema for User model.
 */
export const UserEntity = entity(UserApp.model("User"), {
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: "increment",
    },
    firstName: {
      type: "varchar",
    },
    lastName: {
      type: "varchar",
    },
    password: {
      type: "varchar",
    },
  },
})
