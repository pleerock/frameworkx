import * as typeorm from "typeorm"
import { getConnectionManager } from "typeorm"

/**
 * TypeORM's database connection.
 */
export const AppConnection = getConnectionManager().create({
  type: "sqlite",
  database: __dirname + "/../database.sqlite",
  synchronize: true,
  logging: false,
  typename: "__typename"
})
