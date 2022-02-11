import { CategoryApp } from "../app"
import { entity } from "@microframework/node"

/**
 * Database schema for Category model.
 */
export const CategoryEntity = entity(CategoryApp.model("Category"), {
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
})
