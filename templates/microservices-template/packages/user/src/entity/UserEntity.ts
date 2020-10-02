import { entity } from "typeorm"
import { UserApp } from "../app"

/**
 * Database schema for User model.
 */
export const UserEntity = entity(UserApp.model("User"), {
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
    password: {
      type: "varchar",
    },
  },
})
