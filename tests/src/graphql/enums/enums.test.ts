import { parse } from "@microframework/parser"
import {
  buildGraphQLSchema,
  DefaultNamingStrategy,
} from "@microframework/graphql"
import { isEnumType, isObjectType } from "graphql"

describe("graphql > schema builder", () => {
  const appMetadata = parse(__dirname + "/enums-app.ts")
  const schema = buildGraphQLSchema({
    assert: false,
    appMetadata: appMetadata,
    namingStrategy: DefaultNamingStrategy,
    resolveFactory: () => undefined,
    subscribeFactory: () => undefined,
  })
  if (!schema) fail("Schema built failed")

  test("model with referenced enum type", () => {
    const postType = schema.getType("PostType")
    expect(postType).not.toBe(undefined)

    if (!isObjectType(postType)) fail("PostType is not an object type")
    expect(postType.name).toBe("PostType")

    // ------------------------------------------------

    const statusEnum = schema.getType("StatusEnum")
    expect(statusEnum).not.toBe(undefined)
    console.log(statusEnum!.toConfig())

    if (!isEnumType(statusEnum)) fail("StatusEnum is not a enum type")
    expect(statusEnum.name).toBe("StatusEnum")
    expect(statusEnum.getValues().length).toBe(4)

    expect(statusEnum.getValues()[0].name).toBe("draft")
    expect(statusEnum.getValues()[0].value).toBe("draft")
    expect(statusEnum.getValues()[0].description).toBe("Post is on draft.")

    expect(statusEnum.getValues()[1].name).toBe("published")
    expect(statusEnum.getValues()[1].value).toBe("published")
    expect(statusEnum.getValues()[1].description).toBe("Post is published.")

    expect(statusEnum.getValues()[2].name).toBe("removed")
    expect(statusEnum.getValues()[2].value).toBe("removed")
    expect(statusEnum.getValues()[2].description).toBe("Post is removed.")
    expect(statusEnum.getValues()[2].isDeprecated).toBe(true)
    expect(statusEnum.getValues()[2].deprecationReason).toBe(undefined)

    expect(statusEnum.getValues()[3].name).toBe("watched")
    expect(statusEnum.getValues()[3].value).toBe("watched")
    expect(statusEnum.getValues()[3].description).toBe("Post is watched.")
    expect(statusEnum.getValues()[3].isDeprecated).toBe(true)
    expect(statusEnum.getValues()[3].deprecationReason).toBe(
      "this status is not used anymore.",
    )

    // ------------------------------------------------

    const postCategoryEnum = schema.getType("PostCategoryEnum")
    expect(postCategoryEnum).not.toBe(undefined)

    if (!isEnumType(postCategoryEnum))
      fail("PostCategoryEnum is not a enum type")
    expect(postCategoryEnum.name).toBe("PostCategoryEnum")
    expect(postCategoryEnum.getValues().length).toBe(2)
  })
})
