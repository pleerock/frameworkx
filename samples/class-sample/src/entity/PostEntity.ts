import {app} from "../app";

export const PostEntity = app
  .model("PostType")
  .entity()
  .resolvable(true)
  .schema({
    id: {
      type: "int",
      primary: true,
      generated: "increment"
    },
    title: {
      type: "varchar"
    },
    text: {
      type: "varchar",
      nullable: true
    },
    author: {
      relation: "many-to-one",
    },
    categories: {
      relation: "many-to-many",
      joinTable: true,
      inverseSide: "posts"
    },
  })
