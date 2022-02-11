import { App } from "microframework-template-monorepo-common"
import { entity } from "@microframework/node"

/**
 * Database schema for Category model.
 */
export const CategoryEntity = entity(App.model("Category"), {
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: "increment",
    },
    name: {
      type: "varchar",
    },
  },
  relations: {
    posts: {
      type: "many-to-many",
      target: App.model("Post").name,
      joinTable: false,
      inverseSide: "categories",
    },
  },
})
