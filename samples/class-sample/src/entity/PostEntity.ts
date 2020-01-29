import { entity } from "@microframework/core"
import { AppModels } from "../app/AppModels";

export const PostEntity = entity(AppModels.Post).schema({
  id: {
    type: "int",
    primary: true,
    generated: "increment",
  },
  title: {
    type: "varchar",
  },
  text: {
    type: "varchar",
    nullable: true,
  },
  author: {
    relation: "many-to-one",
  },
  categories: {
    relation: "many-to-many",
    joinTable: true,
    inverseSide: "posts",
  },
})
