import { entity } from "typeorm"

export const PostEntity = entity("Post", {
  projection: {
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
