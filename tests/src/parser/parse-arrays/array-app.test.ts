import { parse } from "@microframework/parser"

describe("parse arrays > array app", () => {
  test("model defined with arrays and declaration", () => {
    const result = parse(__dirname + "/array-app.ts")
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
