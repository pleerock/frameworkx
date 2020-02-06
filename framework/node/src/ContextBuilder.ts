import { Request, Response } from "express";
import { AnyApplication } from "@microframework/core";

/**
 * Resolves context value.
 */
export async function buildContext(app: AnyApplication, options: { request: Request, response: Response }) {
    let resolvedContext: { [key: string]: any } = {
        // we can define default framework context variables here
        request: options.request,
        response: options.response
    }

    // do we need a "proper" context based on properties defined in the App ?
    // for (let contextItem of this.app.metadata.context)

    for (let resolver of app.properties.resolvers) {
        if (resolver.type === "context") {
            for (let contextKey in resolver.resolverFn) {
                if (resolver.resolverFn.hasOwnProperty(contextKey)) {
                    const contextItem = resolver.resolverFn[contextKey]
                    let result = contextItem instanceof Function ? contextItem(options) : contextItem
                    if (result instanceof Promise) {
                        result = await result
                    }
                    resolvedContext[contextKey] = result
                }
            }
        }
    }
    return resolvedContext
}
