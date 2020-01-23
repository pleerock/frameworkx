import {Model} from "@microframework/core";
import {User} from "./User";

export type PostModel = Model<Post, PostArgs>

export type Post = {
  id: number
  name: string
  description: string
  likes: number
  author: User
}

export type PostArgs = {
  description: {
    shorten: number // | null // todo: handle union types
  }
}