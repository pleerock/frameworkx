import { parse } from "@microframework/parser"
import {
  buildGraphQLSchema,
  DefaultNamingStrategy,
} from "@microframework/graphql"
import { isEnumType, isObjectType } from "graphql"

describe("graphql > schema builder", () => {
  test("model (literal type) with literal enum type", () => {
    const appMetadata = parse(__dirname + "/literal-model-literal-enums-app.ts")
    const schema = buildGraphQLSchema({
      assert: false,
      appMetadata: appMetadata,
      namingStrategy: DefaultNamingStrategy,
      resolveFactory: () => undefined,
      subscribeFactory: () => undefined,
    })
    if (!schema) fail("Schema built failed")
    const postType = schema.getType("PostType")
  })
})
