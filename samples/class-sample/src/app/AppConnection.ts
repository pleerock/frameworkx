import * as _typeorm from "typeorm"
import { getConnectionManager } from "typeorm"
import { CategoryEntity, PostEntity, UserEntity } from "../entity";

export const AppConnection = getConnectionManager().create({
  type: "sqlite",
  database: __dirname + "/../database.sqlite",
  synchronize: true,
  logging: false,
  entities: [
      PostEntity,
      UserEntity,
      CategoryEntity,
  ],
})
