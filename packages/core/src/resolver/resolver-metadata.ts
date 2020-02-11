import { ContextResolver, DeclarationResolver, ModelResolver, SubscriptionItemResolver } from "./resolver-strategy"

/**
 * Metadata for declaration resolver.
 */
export type DeclarationResolverMetadata = {
    instanceof: "Resolver"
    type: "declaration-resolver"
    declarationType: "any" | "query" | "mutation" | "subscription" | "action"
    resolverFn: DeclarationResolver<any>
}

/**
 * Metadata for declaration item resolver.
 */
export type DeclarationItemResolverMetadata = {
    instanceof: "Resolver"
    type: "declaration-item-resolver"
    declarationType: "any" | "query" | "mutation" | "subscription" | "action"
    name: string
    resolverFn: ((args: any, context: any) => any) | SubscriptionItemResolver<any, any>
}

/**
 * Metadata for model resolver.
 */
export type ModelResolverMetadata = {
    instanceof: "Resolver"
    type: "model-resolver"
    name: string
    dataLoader: boolean
    resolverFn: ModelResolver<any>
}

/**
 * Metadata for context resolver.
 */
export type ContextResolverMetadata = {
    instanceof: "Resolver"
    type: "context"
    resolverFn: ContextResolver<any>
}

/**
 * Resolver metadata - represents what resolver resolves,
 * how its named and what function should be executed on resolve.
 */
export type ResolverMetadata =
    | DeclarationResolverMetadata
    | DeclarationItemResolverMetadata
    | ModelResolverMetadata
    | ContextResolverMetadata
