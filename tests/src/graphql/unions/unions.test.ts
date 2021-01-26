import { parse } from "@microframework/parser"
import {
  buildGraphQLSchema,
  DefaultNamingStrategy,
} from "@microframework/graphql"
import * as GraphQL from "graphql"
import { assertValidSchema, GraphQLSchema, isUnionType } from "graphql"

describe("graphql > schema builder", () => {
  test("model with union type", () => {
    const appMetadata = parse(__dirname + "/unions-app.ts")
    const schema = new GraphQLSchema(
      buildGraphQLSchema({
        graphql: GraphQL,
        appMetadata: appMetadata,
        namingStrategy: DefaultNamingStrategy,
        resolveFactory: () => undefined,
        subscribeFactory: () => undefined,
      }),
    )
    assertValidSchema(schema)

    if (!schema) fail("Schema built failed")
    const postType = schema.getType("PostType")
    expect(postType).not.toBe(undefined)

    if (!isUnionType(postType)) fail("PostType is not a union type")
    expect(postType.name).toBe("PostType")
    expect(postType.getTypes().length).toBe(2)
    expect(postType.getTypes()[0].name).toBe("BlogPostType")
    expect(postType.getTypes()[1].name).toBe("NewsPostType")

    const postExtendedType = schema.getType("PostExtendedType")
    expect(postExtendedType).not.toBe(undefined)

    if (!isUnionType(postExtendedType))
      fail("PostExtendedType is not a union type")
    expect(postExtendedType.name).toBe("PostExtendedType")
    expect(postExtendedType.getTypes().length).toBe(3)
    expect(postExtendedType.getTypes()[0].name).toBe("BlogPostType")
    expect(postExtendedType.getTypes()[1].name).toBe("NewsPostType")
    expect(postExtendedType.getTypes()[2].name).toBe("PostMetaType")
  })
})
