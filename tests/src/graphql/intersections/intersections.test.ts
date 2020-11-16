import { parse } from "@microframework/parser"
import {
  buildGraphQLSchema,
  DefaultNamingStrategy,
} from "@microframework/graphql"
import { isNonNullType, isObjectType, isScalarType } from "graphql"
import { getRealTypes } from "../../util/test-common"

describe("graphql > schema builder", () => {
  test("app with intersection input and output types", () => {
    const appMetadata = parse(__dirname + "/intersections-app.ts")
    console.log(appMetadata)
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
    expect(types.length).toBe(10)
  })
})
