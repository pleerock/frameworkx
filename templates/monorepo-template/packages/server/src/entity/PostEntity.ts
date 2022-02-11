import { App } from "microframework-template-monorepo-common"
import { entity } from "@microframework/node"

/**
 * Database schema for Post model.
 */
export const PostEntity = entity(App.model("Post"), {
  columns: {
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
  },
  relations: {
    categories: {
      type: "many-to-many",
      target: App.model("Category").name,
      joinTable: true,
      inverseSide: "posts",
    },
  },
})
