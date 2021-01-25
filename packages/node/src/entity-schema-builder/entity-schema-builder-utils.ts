import {
  AnyResolver,
  ApplicationTypeMetadata,
  TypeMetadata,
  TypeMetadataUtils,
} from "@microframework/core"
import { EntityMetadata } from "typeorm"
import { ApplicationServerProperties } from "../application-server"
import { joinStrings } from "@microframework/parser"
// import { ParserUtils } from "@microframework/parser"

const ParserUtils = {
  joinStrings: joinStrings,
}

export const EntitySchemaArgsHelper = {
  /**
   * Recursively creates WhereArgs for entity.
   */
  createWhereArgs(
    appMetadata: ApplicationTypeMetadata,
    appProperties: ApplicationServerProperties,
    entityMetadata: EntityMetadata,
    type: TypeMetadata,
    deepness: number,
    parentName: string,
  ): TypeMetadata[] {
    const allTypes: TypeMetadata[] = []
    for (const key in type.properties) {
      const property = type.properties[key]
      if (TypeMetadataUtils.isPrimitive(property) /* or enum? */) {
        const columnWithSuchProperty = entityMetadata.findColumnsWithPropertyPath(
          property.propertyName!,
        )
        if (columnWithSuchProperty) {
          allTypes.push(
            TypeMetadataUtils.create(property.kind, {
              nullable: true,
              propertyName: property.propertyName,
            }),
          )
        }
      } else {
        const relationWithSuchProperty = entityMetadata.findRelationWithPropertyPath(
          property.propertyName!,
        )
        if (
          relationWithSuchProperty &&
          deepness < appProperties.maxGeneratedConditionsDeepness
        ) {
          const reference = appMetadata.models.find(
            (type) => type.typeName === property.typeName,
          )
          if (!reference)
            throw new Error(`cannot find a type ${property.typeName}`)

          allTypes.push(
            TypeMetadataUtils.create("object", {
              typeName: appProperties.namingStrategy.generatedEntityDeclarationArgsInputs.whereRelation(
                type.typeName!,
                property.propertyName!,
              ),
              nullable: true,
              propertyName: property.propertyName,
              propertyPath: ParserUtils.joinStrings(
                parentName,
                property.propertyName!,
              ),
              properties: this.createWhereArgs(
                appMetadata,
                appProperties,
                relationWithSuchProperty.inverseEntityMetadata,
                reference,
                deepness + 1,
                ParserUtils.joinStrings(parentName, property.propertyName!),
              ),
            }),
          )
        }
      }
    }
    // }
    return allTypes
  },

  /**
   * Recursively creates OrderByArgs for entity.
   */
  createOrderByArgs(
    appMetadata: ApplicationTypeMetadata,
    appProperties: ApplicationServerProperties,
    entityMetadata: EntityMetadata,
    type: TypeMetadata,
    deepness: number,
    parentName: string,
  ): TypeMetadata[] {
    const allTypes: TypeMetadata[] = []
    for (const key in type.properties) {
      // todo: use enum instead of string
      const property = type.properties[key]
      if (TypeMetadataUtils.isPrimitive(property) /* or enum? */) {
        const columnWithSuchProperty = entityMetadata.findColumnsWithPropertyPath(
          property.propertyName!,
        )
        if (columnWithSuchProperty) {
          allTypes.push(
            TypeMetadataUtils.create("string", {
              nullable: true,
              propertyName: property.propertyName,
            }),
          )
        }
      } else {
        const relationWithSuchProperty = entityMetadata.findRelationWithPropertyPath(
          property.propertyName!,
        )
        if (
          relationWithSuchProperty &&
          deepness < appProperties.maxGeneratedConditionsDeepness
        ) {
          const reference = appMetadata.models.find(
            (type) => type.typeName === property.typeName,
          )
          if (!reference)
            throw new Error(`cannot find a type ${property.typeName}`)

          allTypes.push(
            TypeMetadataUtils.create("object", {
              typeName: appProperties.namingStrategy.generatedEntityDeclarationArgsInputs.whereRelation(
                type.typeName!,
                property.propertyName!,
              ),
              nullable: true,
              propertyName: property.propertyName,
              propertyPath: ParserUtils.joinStrings(
                parentName,
                property.propertyName!,
              ),
              properties: this.createOrderByArgs(
                appMetadata,
                appProperties,
                relationWithSuchProperty.inverseEntityMetadata,
                reference,
                deepness + 1,
                ParserUtils.joinStrings(parentName, property.propertyName!),
              ),
            }),
          )
        }
      }
    }
    return allTypes
  },

  /**
   * Recursively creates SaveArgs for entity.
   */
  createSaveArgs(
    appMetadata: ApplicationTypeMetadata,
    appProperties: ApplicationServerProperties,
    entityMetadata: EntityMetadata,
    type: TypeMetadata,
    deepness: number,
    parentName: string,
  ): TypeMetadata[] {
    const allTypes: TypeMetadata[] = []
    for (const key in type.properties) {
      const property = type.properties[key]
      if (TypeMetadataUtils.isPrimitive(property) /* or enum? */) {
        const columnWithSuchProperty = entityMetadata.findColumnsWithPropertyPath(
          property.propertyName!,
        )
        if (columnWithSuchProperty) {
          allTypes.push(
            TypeMetadataUtils.create(property.kind, {
              nullable: true,
              propertyName: property.propertyName,
            }),
          )
        }
      } else {
        const relationWithSuchProperty = entityMetadata.findRelationWithPropertyPath(
          property.propertyName!,
        )
        if (
          relationWithSuchProperty &&
          deepness < appProperties.maxGeneratedConditionsDeepness
        ) {
          const reference = appMetadata.models.find(
            (type) => type.typeName === property.typeName,
          )
          if (!reference)
            throw new Error(`cannot find a type ${property.typeName}`)

          const isArray =
            relationWithSuchProperty.relationType === "many-to-many" ||
            relationWithSuchProperty.relationType === "one-to-many"

          allTypes.push(
            TypeMetadataUtils.create("object", {
              typeName: appProperties.namingStrategy.generatedEntityDeclarationArgsInputs.saveRelation(
                type.typeName!,
                property.propertyName!,
              ),
              nullable: true,
              array: isArray,
              propertyName: property.propertyName,
              properties: this.createSaveArgs(
                appMetadata,
                appProperties,
                relationWithSuchProperty.inverseEntityMetadata,
                reference,
                deepness + 1,
                ParserUtils.joinStrings(parentName, property.propertyName!),
              ),
            }),
          )
        }
      }
    }

    // }
    return allTypes
  },
}

/**
 * Creates an object that helps to register resolvers in the application.
 */
export const ResolverHelper = {
  /**
   * Registers a new resolver in the app.
   */
  pushResolver(
    resolvers: AnyResolver[],
    type: "query" | "mutation" | "subscription",
    name: string,
    resolverFn: any,
  ) {
    // we try to find resolver with the same name to prevent user defined resolver override
    const sameNameResolver = resolvers.find((resolver) => {
      if (resolver.type === "declaration-item-resolver") {
        return resolver.name === name
      } else if (resolver.type === "declaration-resolver") {
        return (resolver.resolverFn as any)[name] !== undefined
      }
      return false
    })

    // register a new resolver
    if (!sameNameResolver) {
      resolvers.push({
        "@type": "Resolver",
        type: "declaration-item-resolver",
        declarationType: type,
        name: name,
        resolverFn: resolverFn,
      })
    }
  },
}

/**
 * Creates an object that helps to register queries, mutations, subscriptions in the application.
 */
export const DeclarationHelper = {
  /**
   * Registers a new query in the application metadata.
   */
  pushQuery(queries: TypeMetadata[], type: TypeMetadata) {
    const sameNameQuery = queries.find(
      (query) => query.propertyName === type.propertyName,
    )
    if (!sameNameQuery) {
      queries.push(type)
    }
  },

  /**
   * Registers a new mutation in the application metadata.
   */
  pushMutation(mutations: TypeMetadata[], type: TypeMetadata) {
    const sameNameMutation = mutations.find(
      (mutation) => mutation.propertyName === type.propertyName,
    )
    if (!sameNameMutation) {
      mutations.push(type)
    }
  },

  /**
   * Registers a new subscription in the application metadata.
   */
  pushSubscription(subscriptions: TypeMetadata[], type: TypeMetadata) {
    const sameNameSubscription = subscriptions.find(
      (subscription) => subscription.propertyName === type.propertyName,
    )
    if (!sameNameSubscription) {
      subscriptions.push(type)
    }
  },
}
