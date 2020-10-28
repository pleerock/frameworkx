import { TypeMetadataUtils } from "@microframework/core"

describe("core > type-metadata > utils", () => {
  test("create", () => {
    expect(
      TypeMetadataUtils.create("number", {
        description: "type about a number",
      }),
    ).toEqual({
      "@type": "TypeMetadata",
      kind: "number",
      description: "type about a number",
      array: false,
      nullable: false,
      canBeUndefined: false,
      properties: [],
    })
  })
  test("isPrimitive", () => {
    expect(
      TypeMetadataUtils.isPrimitive(TypeMetadataUtils.create("string")),
    ).toEqual(true)
    expect(
      TypeMetadataUtils.isPrimitive(TypeMetadataUtils.create("number")),
    ).toEqual(true)
    expect(
      TypeMetadataUtils.isPrimitive(TypeMetadataUtils.create("bigint")),
    ).toEqual(true)
    expect(
      TypeMetadataUtils.isPrimitive(TypeMetadataUtils.create("boolean")),
    ).toEqual(true)
    expect(
      TypeMetadataUtils.isPrimitive(TypeMetadataUtils.create("enum")),
    ).toEqual(false)
    expect(
      TypeMetadataUtils.isPrimitive(TypeMetadataUtils.create("union")),
    ).toEqual(false)
    expect(
      TypeMetadataUtils.isPrimitive(TypeMetadataUtils.create("model")),
    ).toEqual(false)
    expect(
      TypeMetadataUtils.isPrimitive(TypeMetadataUtils.create("object")),
    ).toEqual(false)
    expect(
      TypeMetadataUtils.isPrimitive(TypeMetadataUtils.create("property")),
    ).toEqual(false)
  })
  test("isNameValid", () => {
    expect(TypeMetadataUtils.isNameValid("User")).toEqual(true)
    expect(TypeMetadataUtils.isNameValid("someProperty")).toEqual(true)
    expect(
      TypeMetadataUtils.isNameValid("something_that_should_be_valid"),
    ).toEqual(true)
    expect(
      TypeMetadataUtils.isNameValid("something_that_should-not_be_valid"),
    ).toEqual(false)
  })
})
