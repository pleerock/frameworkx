import { entity } from "@microframework/core"
import { AppModels } from "../app/AppModels";

export const CategoryEntity = entity(AppModels.Category).schema({
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
