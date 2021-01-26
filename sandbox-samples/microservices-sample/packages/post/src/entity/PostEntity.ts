import { entity } from "typeorm"
import { PostApp } from "../app"

/**
 * Database schema for Post model.
 */
export const PostEntity = entity(PostApp.model("Post"), {
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
    categoryId: {
      type: "int",
      nullable: true,
    },
  },
})
