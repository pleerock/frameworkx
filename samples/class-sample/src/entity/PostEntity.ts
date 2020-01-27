import { entity } from "@microframework/core"
import { Post } from "../model"

export const PostEntity = entity<Post>("Post").schema({
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
  author: {
    relation: "many-to-one",
  },
  categories: {
    relation: "many-to-many",
    joinTable: true,
    inverseSide: "posts",
  },
})
