import { parse } from "@microframework/parser"
import {
  buildGraphQLSchema,
  DefaultNamingStrategy,
} from "@microframework/graphql"
import { isUnionType } from "graphql"

describe("graphql > schema builder", () => {
  test("model with union type", () => {
    const appMetadata = parse(__dirname + "/model-unions-app.ts")
    const schema = buildGraphQLSchema({
      assert: false,
      appMetadata: appMetadata,
      namingStrategy: DefaultNamingStrategy,
      resolveFactory: () => undefined,
      subscribeFactory: () => undefined,
    })
    if (!schema) fail("Schema built failed")
    const postType = schema.getType("PostType")
    expect(postType).not.toBe(undefined)

    if (!isUnionType(postType)) fail("PostType is not a union type")
    expect(postType.name).toBe("PostType")
    expect(postType.getTypes().length).toBe(2)
    expect(postType.getTypes()[0].name).toBe("BlogPostType")
    expect(postType.getTypes()[1].name).toBe("NewsPostType")

    // TODO: test all cases
  })
})
