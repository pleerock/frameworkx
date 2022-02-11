import { App } from "../app"
import { entity } from "@microframework/node"

/**
 * Database schema for User model.
 */
export const UserEntity = entity(App.model("User"), {
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
  },
})
