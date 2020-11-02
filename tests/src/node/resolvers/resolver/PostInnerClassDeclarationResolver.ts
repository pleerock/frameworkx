import { DeclarationResolver, resolver } from "@microframework/core"
import { App } from "../app"
import { InputOf } from "@microframework/core"

export const PostInnerClassDeclarationResolver = resolver(
  App,
  class implements DeclarationResolver<typeof App> {
    posts() {
      return [
        { id: 1, title: "Post #1" },
        { id: 2, title: "Post #2" },
      ]
    }
    post({ id }: InputOf<typeof App, "post">) {
      return { id, title: "Post #" + id }
    }
  },
)
