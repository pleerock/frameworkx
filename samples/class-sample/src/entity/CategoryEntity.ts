import { entity } from "@microframework/core"
import { Category } from "../model/Category"

export const CategoryEntity = entity<Category>("CategoryType").schema({
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
    joinTable: false,
    inverseSide: "categories",
  },
})
