import { getConnectionManager } from "typeorm"

/**
 * TypeORM's database connection.
 */
export const AppConnection = getConnectionManager().create({
  type: "sqlite",
  database: __dirname + "/../database.sqlite",
  synchronize: true,
  logging: true,
  typename: "__typename",
})
