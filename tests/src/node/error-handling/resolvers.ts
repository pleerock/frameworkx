import { resolver } from "@microframework/core"
import { CodeError, HttpError } from "@microframework/node"
import { App } from "./app"

export const PostResolver = resolver(App, "post", ({ id }) => {
  if (id <= 0) throw new CodeError("900009", `Post id isn't valid.`)
  return {
    id,
    title: "Hello",
  }
})

export const PostSaveResolver = resolver(App, "postSave", ({ id }) => {
  return true
})

export const PostsActionResolver = resolver(App, "get /posts", () => {
  throw new Error(`You have no access to this content.`)
})

export const PostsNewActionResolver = resolver(App, "get /posts-new", () => {
  throw new CodeError("NO_ACCESS", `You have no access to this content.`)
})

export const PostsOldActionResolver = resolver(App, "get /posts-old", () => {
  throw new HttpError(400, `You have no access to this content.`)
})

export const PostTypeResolver = resolver(App, "PostType", {
  status() {
    throw new CodeError("CANT_SET_STATUS", `Status can't be set.`)
  },
})
