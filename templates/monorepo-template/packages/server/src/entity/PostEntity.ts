import { entity } from "typeorm"
import { App } from "microframework-template-monorepo-common"

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
