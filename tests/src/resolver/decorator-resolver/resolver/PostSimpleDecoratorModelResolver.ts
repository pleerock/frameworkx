import { ModelResolver, resolver } from "@microframework/core";
import { App } from "../app";
import { PostType } from "../model/PostType";

@resolver(App, "PostType")
export class PostSimpleDecoratorModelResolver implements ModelResolver<PostType> {

    status() {
        return "draft"
    }

}
