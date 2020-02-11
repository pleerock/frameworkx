import * as typeorm from "typeorm"
import { entity } from "typeorm"
import { AppModels } from "../app/AppModels"

/**
 * Database schema for Category model.
 */
export const CategoryEntity = entity(AppModels.Category, {
  projection: {
    id: {
      type: "int",
      primary: true,
      generated: "increment",
    },
    name: {
      type: "varchar",
    },
    posts: {
      relation: "many-to-many",
      owner: false,
      inverse: "categories",
    },
  },
})
