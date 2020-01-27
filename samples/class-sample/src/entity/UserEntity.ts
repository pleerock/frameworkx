import { entity } from "@microframework/core"
import { UserType } from "../model/User"

export const UserEntity = entity<UserType>("UserType").schema({
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
