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
  test("app types defined with arrays", () => {
    const appMetadata = parse(__dirname + "/arrays-app.ts")
    console.log(JSON.stringify(appMetadata, undefined, 2))
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
    console.log(types)

    // ------------------------------------------------

    const postType = schema.getType("PostType")
    expect(postType).not.toBe(undefined)

    if (!isObjectType(postType)) fail("PostType is not an object type")
    expect(postType.name).toBe("PostType")
  })
})
