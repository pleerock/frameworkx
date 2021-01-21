import { parse } from "@microframework/parser"

describe("parse models > declaration with array", () => {
  test("model defined with arrays and declaration", () => {
    const result = parse(__dirname + "/declaration-with-array-app.ts")
    const categoryModel = result.models.find(
      (model) => model.typeName === "Category",
    )
    const posts = categoryModel!.properties.find(
      (property) => property.propertyPath === "Category.posts",
    )

    expect(posts!.kind).toBe("reference")
    expect(posts!.array).toBeTruthy()
    expect(posts!.properties.length).toEqual(0)
  })
})
