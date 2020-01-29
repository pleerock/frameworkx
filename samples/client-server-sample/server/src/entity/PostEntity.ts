import { PostType } from "@microframework/client-server-sample-common";
import { entity } from "@microframework/core";

export const PostEntity = entity<PostType>("PostType").schema({
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
