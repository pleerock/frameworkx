import { resolver } from "@microframework/core";
import { App } from "../app";
import { PostType } from "../model/PostType";

export const PostObjectModelResolver = resolver(App, "PostType", {
    status() {
        return "draft"
    }
})
