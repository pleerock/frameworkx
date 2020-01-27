import { entity } from "@microframework/core"
import { User } from "../model"

export const UserEntity = entity<User>("User").schema({
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
})
