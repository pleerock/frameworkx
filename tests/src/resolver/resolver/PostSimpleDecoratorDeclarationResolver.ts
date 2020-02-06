import { resolver } from "@microframework/core";

@resolver()
export class PostSimpleDecoratorDeclarationResolver {

    posts() {
        return [
            { id: 1, title: "Post #1" },
            { id: 2, title: "Post #2" },
        ]
    }

}