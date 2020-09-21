import { DeclarationResolver, resolver } from "@microframework/core"
import { App } from "../app"

@resolver()
export class PostSimpleDecoratorDeclarationResolver
  implements DeclarationResolver<typeof App> {
  posts() {
    return [
      { id: 1, title: "Post #1" },
      { id: 2, title: "Post #2" },
    ]
  }
}
