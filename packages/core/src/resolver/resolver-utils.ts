import { ListOfType } from "../application"
import { AppResolverType } from "./resolver-helper-types"
import { DeclarationResolverMetadata, ResolverMetadata, } from "./resolver-metadata"

/**
 * Core resolver utility functions.
 */
export const ResolverUtils = {
  /**
   * Creates resolver metadatas from a given array of mixed resolver types.
   */
  normalizeResolverMetadatas(
    givenResolvers: ListOfType<AppResolverType>,
  ): ResolverMetadata[] {
    const resolvers: ResolverMetadata[] = []
    if (givenResolvers instanceof Array) {
      resolvers.push(
        ...givenResolvers.map((resolver) => {
          if (resolver instanceof Function) {
            return resolver.prototype.resolver
          } else if (
            resolver instanceof Object &&
            !this.isResolverMetadata(resolver)
          ) {
            return {
              typeof: "Resolver",
              type: "declaration-resolver",
              declarationType: "any",
              resolverFn: resolver,
            } as DeclarationResolverMetadata
          } else {
            return resolver
          }
        }),
      )
    } else {
      resolvers.push(
        ...Object.keys(givenResolvers).map((key) => {
          const resolver = (givenResolvers as any)[key]
          if (resolver instanceof Function) {
            return resolver.prototype.resolver
          } else if (
            resolver instanceof Object &&
            !this.isResolverMetadata(resolver)
          ) {
            return {
              typeof: "Resolver",
              type: "declaration-resolver",
              declarationType: "any",
              resolverFn: resolver,
            } as DeclarationResolverMetadata
          } else {
            return resolver
          }
        }),
      )
    }
    return resolvers
  },

  /**
   * Checks if provided object is resolver metadata.
   */
  isResolverMetadata(obj: any): obj is ResolverMetadata {
    return obj["typeof"] && obj["typeof"] === "Resolver"
  },
}
