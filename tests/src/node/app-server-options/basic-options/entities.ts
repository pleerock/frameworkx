import { entity } from "@microframework/node"

export const PostEntity = entity("Post", {
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: "increment",
    },
    title: {
      type: "varchar",
    },
  },
})
