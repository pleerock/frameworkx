import { GraphQLSchemaBuilderOptions } from "./GraphQLSchemaBuilderOptions"
import { GraphQLSchemaBuilder } from "./GraphQLSchemaBuilder"
import { GraphQLSchema } from "graphql"

export * from "./BigIntScalar"
export * from "./GraphQLSchemaBuilder"
export * from "./GraphQLSchemaBuilderNamingStrategy"

export function buildGraphQLSchema(
  options: GraphQLSchemaBuilderOptions,
): GraphQLSchema | undefined {
  const builder = new GraphQLSchemaBuilder(options)
  if (!builder.canHaveSchema()) return undefined
  return builder.build()
}
