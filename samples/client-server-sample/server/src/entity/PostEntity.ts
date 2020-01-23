import {app} from "@microframework/client-server-sample-common";

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
      type: "varchar"
    },
    author: {
      relation: "many-to-one",
    },
    categories: {
      relation: "many-to-many" as const,
      joinTable: true,
      inverseSide: "posts"
    },
  })
