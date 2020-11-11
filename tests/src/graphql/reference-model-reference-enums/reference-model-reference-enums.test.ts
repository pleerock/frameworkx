import { parse } from "@microframework/parser"
import {
  buildGraphQLSchema,
  DefaultNamingStrategy,
} from "@microframework/graphql"
import { isEnumType, isObjectType } from "graphql"

describe("graphql > schema builder", () => {
  test("model (referenced type) with reference enum type", () => {
    const appMetadata = parse(
      __dirname + "/reference-model-reference-enums-app.ts",
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
    expect(postStatusType.getValues().length).toBe(4)

    expect(postStatusType.getValues()[0].name).toBe("draft")
    expect(postStatusType.getValues()[0].value).toBe("draft")
    expect(postStatusType.getValues()[0].description).toBe("Post is on draft.")

    expect(postStatusType.getValues()[1].name).toBe("published")
    expect(postStatusType.getValues()[1].value).toBe("published")
    expect(postStatusType.getValues()[1].description).toBe("Post is published.")

    expect(postStatusType.getValues()[2].name).toBe("removed")
    expect(postStatusType.getValues()[2].value).toBe("removed")
    expect(postStatusType.getValues()[2].description).toBe("Post is removed.")
    expect(postStatusType.getValues()[2].isDeprecated).toBe(true)
    expect(postStatusType.getValues()[2].deprecationReason).toBe(undefined)

    expect(postStatusType.getValues()[3].name).toBe("watched")
    expect(postStatusType.getValues()[3].value).toBe("watched")
    expect(postStatusType.getValues()[3].description).toBe("Post is watched.")
    expect(postStatusType.getValues()[3].isDeprecated).toBe(true)
    expect(postStatusType.getValues()[3].deprecationReason).toBe(
      "this status is not used anymore.",
    )
  })
})
