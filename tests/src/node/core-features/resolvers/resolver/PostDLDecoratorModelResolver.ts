import { ModelDLResolver, resolver } from "@microframework/core"
import { App } from "../app"
import { PostType } from "../models"

@resolver({ app: App, name: "PostType", dataLoader: true })
export class PostDLDecoratorModelResolver implements ModelDLResolver<PostType> {
  status(posts: PostType[]) {
    return posts.map((_) => "draft")
  }
}
