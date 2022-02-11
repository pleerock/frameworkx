import { DataSource } from "typeorm"
import * as entities from "../entity"

/**
 * TypeORM's DataSource.
 */
export const CategoryDataSource = new DataSource({
  type: "sqlite",
  database: __dirname + "/../database.sqlite",
  synchronize: true,
  logging: true,
  typename: "__typename",
  entities,
})
