import { entity } from "typeorm"
import { App } from "../app"

/**
 * Database schema for Post model.
 */
export const PostEntity = entity(App.model("Post"), {
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
    categories: {
      relation: "many-to-many",
      owner: true,
      inverse: "posts",
    },
  },
})
