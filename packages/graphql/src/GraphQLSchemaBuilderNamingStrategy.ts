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
   * Names for root types - for Query, Mutation and Subscription.
   */
  defaultTypeName(type: "query" | "mutation" | "subscription"): string

  /**
   * Descriptions for root types - for Query, Mutation and Subscription.
   */
  defaultTypeDescription(type: "query" | "mutation" | "subscription"): string
}
