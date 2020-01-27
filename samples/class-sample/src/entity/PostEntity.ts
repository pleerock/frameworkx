import { entity } from "@microframework/core"
import { PostType } from "../model/Post"

export const PostEntity = entity<PostType>("PostType").schema({
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
