import { parse } from "@microframework/parser"
import {
  buildGraphQLSchema,
  DefaultNamingStrategy,
} from "@microframework/graphql"
import { isInputObjectType, isNonNullType, isScalarType } from "graphql"

describe("graphql > schema builder", () => {
  test("input with intersection type", () => {
    const appMetadata = parse(__dirname + "/input-intersections-app.ts")
    const schema = buildGraphQLSchema({
      assert: false,
      appMetadata: appMetadata,
      namingStrategy: DefaultNamingStrategy,
      resolveFactory: () => undefined,
      subscribeFactory: () => undefined,
    })
    if (!schema) fail("Schema built failed")
    console.log(schema.toConfig())

    // ------------------------------------------------

    const postInput = schema.getType("PostInput")
    expect(postInput).not.toBe(undefined)

    if (!isInputObjectType(postInput))
      fail("PostInput is not an object input type")
    expect(postInput.name).toBe("PostInput")

    const id = postInput.getFields()["id"]
    expect(id).not.toBe(undefined)
    if (!isNonNullType(id.type)) fail(`"id" is nullable`)
    expect(isScalarType(id.type.ofType)).toBe(true)
    expect(id.type.ofType.name).toBe("Int")

    const title = postInput.getFields()["title"]
    expect(title).not.toBe(undefined)
    if (!isNonNullType(title.type)) fail(`"title" is nullable`)
    expect(isScalarType(title.type.ofType)).toBe(true)
    expect(title.type.ofType.name).toBe("String")

    const rating = postInput.getFields()["rating"]
    expect(rating).not.toBe(undefined)
    if (!isNonNullType(rating.type)) fail(`"rating" is nullable`)
    expect(isScalarType(rating.type.ofType)).toBe(true)
    expect(rating.type.ofType.name).toBe("Int")

    // ------------------------------------------------

    // TODO: make other checks after Umed's fixes
    fail()
  })
})
