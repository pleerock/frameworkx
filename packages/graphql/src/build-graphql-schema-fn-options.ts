import { ApplicationTypeMetadata, TypeMetadata } from "@microframework/core"
import { GraphQLFieldResolver } from "graphql/type/definition"
import { GraphQLSchemaBuilderNamingStrategy } from "./naming-strategy"
import * as GraphQL from "graphql"

/**
 * GraphQLSchemaBuilder options.
 */
export type GraphQLSchemaBuilderOptions = {
  /**
   * GraphQL package to use for schema build.
   */
  graphql: typeof GraphQL

  /**
   * The whole application metadata that needs to be built.
   */
  appMetadata: ApplicationTypeMetadata

  /**
   * Naming strategy to use during schema build.
   */
  namingStrategy: GraphQLSchemaBuilderNamingStrategy

  /**
   * Function that builds a "resolve" property of a GraphQL "subscription" object type.
   */
  resolveFactory(
    type: "query" | "mutation" | "subscription" | "model",
    metadata: TypeMetadata,
    parentTypeName?: string,
  ): GraphQLFieldResolver<any, any, any> | undefined

  /**
   * Function that builds a "subscribe" property of a GraphQL "subscription" object type.
   */
  subscribeFactory(
    metadata: TypeMetadata,
  ): GraphQLFieldResolver<any, any, any> | undefined
}
