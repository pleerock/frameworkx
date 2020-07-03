import { resolver } from "@microframework/core"
import { App } from "../app"

export const PostObjectActionDeclarationResolver = resolver(App, {
  ["get /posts"]() {
    return [
      { id: 1, title: "Post #1", status: "draft" as const },
      { id: 2, title: "Post #2", status: "draft" as const },
    ]
  },

  ["get /post/:id"]({ params }) {
    return {
      id: params.id,
      title: "Post #" + params.id,
      status: "draft" as const,
    }
  },
})
