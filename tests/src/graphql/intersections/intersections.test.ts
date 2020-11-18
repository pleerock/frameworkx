import { parse } from "@microframework/parser"
import {
  buildGraphQLSchema,
  DefaultNamingStrategy,
} from "@microframework/graphql"
import {
  isInputObjectType,
  isNonNullType,
  isObjectType,
  isScalarType,
} from "graphql"
import { getRealTypes } from "../../util/test-common"
import { TypeMetadataUtils } from "@microframework/core"

describe("graphql > schema builder", () => {
  test("app with intersection input and output types", () => {
    const appMetadata = parse(__dirname + "/intersections-app.ts")
    const schema = buildGraphQLSchema({
      assert: false,
      appMetadata: appMetadata,
      namingStrategy: DefaultNamingStrategy,
      resolveFactory: () => undefined,
      subscribeFactory: () => undefined,
    })
    if (!schema) fail("Schema built failed")

    const types = getRealTypes(
      Object.keys(schema.getTypeMap()).map((key) => key),
    )

    // ------------------------------------------------

    const postType = schema.getType("PostType")
    expect(postType).not.toBe(undefined)

    if (!isObjectType(postType)) fail("PostType is not an object type")
    expect(postType.name).toBe("PostType")

    // ------------------------------------------------

    const postCategoryType = schema.getType("PostCategoryType")
    expect(postCategoryType).not.toBe(undefined)

    if (!isObjectType(postCategoryType))
      fail("PostCategoryType is not an object type")
    expect(postCategoryType.name).toBe("PostCategoryType")

    // ------------------------------------------------

    const postInput = schema.getType("PostInput")
    expect(postInput).not.toBe(undefined)

    if (!isInputObjectType(postInput)) fail("PostInput is not an object type")
    expect(postInput.name).toBe("PostInput")

    // ------------------------------------------------

    const postCategoryInput = schema.getType("PostCategoryInput")
    expect(postCategoryInput).not.toBe(undefined)

    if (!isInputObjectType(postCategoryInput))
      fail("PostCategoryInput is not an object type")
    expect(postCategoryInput.name).toBe("PostCategoryInput")
  })
})
