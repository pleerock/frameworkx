import { DeclarationResolver, resolver } from "@microframework/core"
import { App } from "../app"
import { DeclarationArgs } from "@microframework/core/_"

export const PostInnerClassDeclarationResolver = resolver(
  App,
  class implements DeclarationResolver<typeof App> {
    posts() {
      return [
        { id: 1, title: "Post #1" },
        { id: 2, title: "Post #2" },
      ]
    }
    post({ id }: DeclarationArgs<typeof App, "post">) {
      return { id, title: "Post #" + id }
    }
  },
)
