import { entity } from "typeorm"
import { App } from "../app"

/**
 * Database schema for User model.
 */
export const UserEntity = entity(App.model("User"), {
  projection: {
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
