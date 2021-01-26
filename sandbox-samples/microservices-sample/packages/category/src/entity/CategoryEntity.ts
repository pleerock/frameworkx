import { entity } from "typeorm"
import { CategoryApp } from "../app"

/**
 * Database schema for Category model.
 */
export const CategoryEntity = entity(CategoryApp.model("Category"), {
  projection: {
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
