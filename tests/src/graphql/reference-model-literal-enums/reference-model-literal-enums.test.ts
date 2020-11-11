import { parse } from "@microframework/parser"
import {
  buildGraphQLSchema,
  DefaultNamingStrategy,
} from "@microframework/graphql"
import { isEnumType, isObjectType } from "graphql"

describe("graphql > schema builder", () => {
  test("model (referenced type) with literal enum type", () => {
    const appMetadata = parse(
      __dirname + "/reference-model-literal-enums-app.ts",
    )
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

    const postStatusType = schema.getType("PostStatusType")
    expect(postStatusType).not.toBe(undefined)

    if (!isObjectType(postType)) fail("PostType is not an object type")
    expect(postType.name).toBe("PostType")

    if (!isEnumType(postStatusType)) fail("PostStatusType is not a enum type")
    expect(postStatusType.name).toBe("PostStatusType")
    expect(postStatusType.getValues().length).toBe(2)
    expect(postStatusType.getValues()[0].name).toBe("draft")
    expect(postStatusType.getValues()[0].value).toBe("draft")
    expect(postStatusType.getValues()[1].name).toBe("published")
    expect(postStatusType.getValues()[1].value).toBe("published")

    // TODO: test second enum
    fail()
  })
})
