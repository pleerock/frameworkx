import * as typeorm from "typeorm"
import { entity } from "typeorm"
import { AppModels } from "../app/AppModels";

export const UserEntity = entity(AppModels.User, {
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
  }
})