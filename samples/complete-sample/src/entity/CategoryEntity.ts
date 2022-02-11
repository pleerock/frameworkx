import { entity } from "@microframework/node"
import { App } from "../app"

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
      target: App.model("Post"),
      joinTable: false,
      inverseSide: "categories",
    },
  },
})
