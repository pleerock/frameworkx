import { parse } from "@microframework/parser"
import {
  buildGraphQLSchema,
  DefaultNamingStrategy,
} from "@microframework/graphql"
import { isEnumType, isInputObjectType } from "graphql"

describe("graphql > schema builder", () => {
  test("input (referenced type) with literal enum type", () => {
    const appMetadata = parse(
      __dirname + "/reference-input-literal-enums-app.ts",
    )
    const schema = buildGraphQLSchema({
      assert: false,
      appMetadata: appMetadata,
      namingStrategy: DefaultNamingStrategy,
      resolveFactory: () => undefined,
      subscribeFactory: () => undefined,
    })
    if (!schema) fail("Schema built failed")
    const postInput = schema.getType("PostInput")
    expect(postInput).not.toBe(undefined)

    if (!isInputObjectType(postInput)) fail("PostInput is not an object type")
    expect(postInput.name).toBe("PostInput")
    console.log(postInput.toConfig())

    // if (!isEnumType(postStatusType)) fail("PostStatusType is not a enum type")
    // expect(postStatusType.name).toBe("PostStatusType")
    // expect(postStatusType.getValues().length).toBe(2)
    // expect(postStatusType.getValues()[0].name).toBe("draft")
    // expect(postStatusType.getValues()[0].value).toBe("draft")
    // expect(postStatusType.getValues()[1].name).toBe("published")
    // expect(postStatusType.getValues()[1].value).toBe("published")
  })
})
