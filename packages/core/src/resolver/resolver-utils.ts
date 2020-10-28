import { ApplicationUtils, MixedList } from "../application"
import { AppResolverType } from "./resolver-helper-types"
import { DeclarationResolverMetadata, AnyResolver } from "./resolver-metadata"

/**
 * Core resolver utility functions.
 */
export const ResolverUtils = {
  /**
   * Creates resolver metadatas from a given array of mixed resolver types.
   */
  normalizeResolverMetadatas(
    resolvers: MixedList<AppResolverType>,
  ): AnyResolver[] {
    return ApplicationUtils.mixedListToArray(resolvers).map((resolver) => {
      if (resolver instanceof Function) {
        return resolver.prototype.resolver
      } else if (
        resolver instanceof Object &&
        !this.isResolverMetadata(resolver)
      ) {
        return {
          "@type": "Resolver",
          type: "declaration-resolver",
          declarationType: "any",
          resolverFn: resolver,
        } as DeclarationResolverMetadata
      } else {
        return resolver
      }
    })
  },

  /**
   * Checks if provided object is resolver metadata.
   */
  isResolverMetadata(obj: any): obj is AnyResolver {
    return obj["@type"] && obj["@type"] === "Resolver"
  },
}
