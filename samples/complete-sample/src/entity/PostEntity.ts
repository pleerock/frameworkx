import * as typeorm from "typeorm"
import { entity } from "typeorm"
import { AppModels } from "../app/AppModels"

/**
 * Database schema for Post model.
 */
export const PostEntity = entity(AppModels.Post, {
  projection: {
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
      owner: true,
      inverse: "posts",
    },
  },
})
