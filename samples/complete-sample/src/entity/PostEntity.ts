import { App } from "../app"
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
    author: {
      type: "many-to-one",
      target: App.model("User"),
    },
    categories: {
      type: "many-to-many",
      target: App.model("Category"),
      joinTable: true,
      inverseSide: "posts",
    },
  },
})
