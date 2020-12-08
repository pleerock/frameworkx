import { TypeMetadata } from "@microframework/core"

/**
 * Naming strategy for generated GraphQL types.
 */
export type GraphQLSchemaBuilderNamingStrategy = {
  /**
   * What name should be used for Inputs without name defined.
   */
  namelessInput(): string

  /**
   * What name should be used for Models without name defined.
   */
  namelessModel(): string

  /**
   * Generates a model name for a nameless TypeMetadata.
   */
  modelTypeName(type: TypeMetadata): string

  /**
   * Generates an input name for a nameless TypeMetadata.
   */
  inputTypeName(type: TypeMetadata): string

  /**
   * Generates enum name for a nameless TypeMetadata.
   */
  enumTypeName(type: TypeMetadata): string

  /**
   * Generates union name for a nameless TypeMetadata.
   */
  unionTypeName(type: TypeMetadata): string

  /**
   * Names for root types - for Query, Mutation and Subscription.
   */
  defaultTypeName(type: "query" | "mutation" | "subscription"): string

  /**
   * Descriptions for root types - for Query, Mutation and Subscription.
   */
  defaultTypeDescription(type: "query" | "mutation" | "subscription"): string
}
