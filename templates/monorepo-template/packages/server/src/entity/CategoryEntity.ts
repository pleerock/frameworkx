import { entity } from "typeorm"
import { App } from "microframework-template-monorepo-common"

/**
 * Database schema for Category model.
 */
export const CategoryEntity = entity(App.model("Category"), {
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
