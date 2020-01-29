import { entity } from "@microframework/core"
import { AppModels } from "../app/AppModels";

export const UserEntity = entity(AppModels.User).schema({
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
