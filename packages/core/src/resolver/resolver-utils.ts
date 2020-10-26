import { ApplicationUtils, MixedList } from "../application"
import { AppResolverType } from "./resolver-helper-types"
import {
  DeclarationResolverMetadata,
  ResolverMetadata,
} from "./resolver-metadata"

/**
 * Core resolver utility functions.
 */
export const ResolverUtils = {
  /**
   * Creates resolver metadatas from a given array of mixed resolver types.
   */
  normalizeResolverMetadatas(
    resolvers: MixedList<AppResolverType>,
  ): ResolverMetadata[] {
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
  isResolverMetadata(obj: any): obj is ResolverMetadata {
    return obj["@type"] && obj["@type"] === "Resolver"
  },
}
