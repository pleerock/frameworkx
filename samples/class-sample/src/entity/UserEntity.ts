import { entity } from "@microframework/core"
import { User } from "../model/User"

export const UserEntity = entity<User>("UserType").schema({
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
