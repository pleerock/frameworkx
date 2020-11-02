import {
  ContextResolver,
  DeclarationResolver,
  ModelResolver,
  SubscriptionDeclarationItemResolver,
} from "./resolver-strategy"

/**
 * Metadata for declaration object resolver.
 */
export type DeclarationResolverMetadata = {
  "@type": "Resolver"
  type: "declaration-resolver"
  declarationType: "any" | "query" | "mutation" | "subscription" | "action"
  resolverFn: DeclarationResolver<any>
}

/**
 * Metadata for declaration single item resolver.
 */
export type DeclarationItemResolverMetadata = {
  "@type": "Resolver"
  type: "declaration-item-resolver"
  declarationType: "any" | "query" | "mutation" | "subscription" | "action"
  name: string
  resolverFn:
    | ((args: any, context: any) => any)
    | SubscriptionDeclarationItemResolver<any, any>
}

/**
 * Metadata for model resolver.
 */
export type ModelResolverMetadata = {
  "@type": "Resolver"
  type: "model-resolver"
  name: string
  dataLoader: boolean
  resolverFn: ModelResolver<any>
}

/**
 * Metadata for context resolver.
 */
export type ContextResolverMetadata = {
  "@type": "Resolver"
  type: "context"
  resolverFn: ContextResolver<any>
}

/**
 * Represents any resolver type -
 * declaration resolver, declaration item resolver, model resolver, context resolver
 */
export type AnyResolver =
  | DeclarationResolverMetadata
  | DeclarationItemResolverMetadata
  | ModelResolverMetadata
  | ContextResolverMetadata
