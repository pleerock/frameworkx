import { UserType } from "@microframework/client-server-sample-common";
import { entity } from "@microframework/core";

export const UserEntity = entity<UserType>("UserType").schema({
    id: {
      type: "int",
      primary: true,
      generated: "increment"
    },
    firstName: {
      type: "varchar"
    },
    lastName: {
      type: "varchar"
    },
  })
