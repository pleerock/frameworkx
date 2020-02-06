import { DeclarationResolver, ModelResolver, SubscriptionItemResolver } from "./resolver-strategy"

/**
 * Resolver metadata - represents what resolver resolves,
 * how its named and what function should be executed on resolve.
 *
 * todo: shall we add context?
 */
export type ResolverMetadata = {
    instanceof: "Resolver"
    type: "declaration-resolver"
    declarationType: "any" | "query" | "mutation" | "subscription" | "action"
    resolverFn: DeclarationResolver<any>
  } | {
    instanceof: "Resolver"
    type: "declaration-item-resolver"
    declarationType: "any" | "query" | "mutation" | "subscription" | "action"
    name: string
    resolverFn: ((args: any, context: any) => any) | SubscriptionItemResolver<any, any>
  } | {
    instanceof: "Resolver"
    type: "model-resolver"
    name: string
    dataLoader: boolean
    resolverFn: ModelResolver<any>
  }

/**
 * Checks if provided object is resolver metadata.
 */
export function isResolverMetadata(obj: any): obj is ResolverMetadata {
    return obj["instanceof"] && obj["instanceof"] === "Resolver"
}