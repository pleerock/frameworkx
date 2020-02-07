import { ResolverMetadata, TypeMetadata } from "@microframework/core";
import { Request, Response } from "express";
import { MappedEntitySchemaProperty } from "typeorm";

export const Utils = {

  generateRandomString(length: number) {
    let result = ""
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
    const charactersLength = characters.length
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return result
  },

  modelsToApp(models: TypeMetadata[]): MappedEntitySchemaProperty[] {
    const mappedEntities: MappedEntitySchemaProperty[] = []
    for (let model of models) {
      for (let property of model.properties) {
        mappedEntities.push({
          model: model.typeName!,
          property: property.propertyName!,
          target: property.typeName!
        })
      }
    }
    return mappedEntities
  },

  async buildContext(
      resolvers: ResolverMetadata[],
      options: { request: Request, response: Response }
  ) {
    let resolvedContext: { [key: string]: any } = {
      // we can define default framework context variables here
      request: options.request,
      response: options.response
    }

    // do we need a "proper" context based on properties defined in the App ?
    // for (let contextItem of this.app.metadata.context)

    for (let resolver of resolvers) {
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
}
