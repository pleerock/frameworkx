import { parse } from "@microframework/parser"
import {
  buildGraphQLSchema,
  DefaultNamingStrategy,
} from "@microframework/graphql"
import { isNonNullType, isObjectType, isScalarType } from "graphql"

describe("graphql > schema builder", () => {
  test("model with intersection type", () => {
    const appMetadata = parse(__dirname + "/model-intersections-app.ts")
    const schema = buildGraphQLSchema({
      assert: false,
      appMetadata: appMetadata,
      namingStrategy: DefaultNamingStrategy,
      resolveFactory: () => undefined,
      subscribeFactory: () => undefined,
    })
    if (!schema) fail("Schema built failed")

    // ------------------------------------------------

    const postType = schema.getType("PostType")
    expect(postType).not.toBe(undefined)

    if (!isObjectType(postType)) fail("PostType is not an object type")
    expect(postType.name).toBe("PostType")

    const id = postType.getFields()["id"]
    expect(id).not.toBe(undefined)
    if (!isNonNullType(id.type)) fail(`"id" is nullable`)
    expect(isScalarType(id.type.ofType)).toBe(true)
    expect(id.type.ofType.name).toBe("Int")

    const title = postType.getFields()["title"]
    expect(title).not.toBe(undefined)
    if (!isNonNullType(title.type)) fail(`"title" is nullable`)
    expect(isScalarType(title.type.ofType)).toBe(true)
    expect(title.type.ofType.name).toBe("String")

    const rating = postType.getFields()["rating"]
    expect(rating).not.toBe(undefined)
    if (!isNonNullType(rating.type)) fail(`"rating" is nullable`)
    expect(isScalarType(rating.type.ofType)).toBe(true)
    expect(rating.type.ofType.name).toBe("Int")

    // ------------------------------------------------

    // TODO: make other checks after Umed's fixes
    fail()
  })
})
