import { parse } from "@microframework/parser"

describe("parse queries > nullable-undefined", () => {
  const result = parse(__dirname + "/app.ts")

  test("inputs", () => {
    const postFilterInput = result.inputs.find(
      (it) => it.typeName === "PostFilterInput",
    )!
    const postFilterInputId = postFilterInput.properties.find(
      (it) => it.propertyName === "id",
    )!
    const postFilterInputName = postFilterInput.properties.find(
      (it) => it.propertyName === "name",
    )!
    const postFilterInputTitle = postFilterInput.properties.find(
      (it) => it.propertyName === "title",
    )!
    const postFilterInputText = postFilterInput.properties.find(
      (it) => it.propertyName === "text",
    )!

    expect(postFilterInput.nullable).toBe(false)
    expect(postFilterInput.canBeUndefined).toBe(false)

    expect(postFilterInputId.nullable).toBe(false)
    expect(postFilterInputId.canBeUndefined).toBe(false)

    expect(postFilterInputName.nullable).toBe(true)
    expect(postFilterInputName.canBeUndefined).toBe(false)

    expect(postFilterInputTitle.nullable).toBe(false)
    expect(postFilterInputTitle.canBeUndefined).toBe(true)

    expect(postFilterInputText.nullable).toBe(true)
    expect(postFilterInputText.canBeUndefined).toBe(true)
  })

  test("queries", () => {
    const postA = result.queries.find((it) => it.propertyName === "postA")!
    expect(postA.returnType).not.toBe(undefined)
    expect(postA.returnType!.nullable).toBe(false)
    expect(postA.returnType!.canBeUndefined).toBe(true)

    const postAInputId = postA.args[0].properties.find(
      (it) => it.propertyName === "id",
    )!
    expect(postAInputId.nullable).toBe(false)
    expect(postAInputId.canBeUndefined).toBe(false)

    const postB = result.queries.find((it) => it.propertyName === "postB")!
    expect(postB.returnType).not.toBe(undefined)
    expect(postB.returnType!.nullable).toBe(true)
    expect(postB.returnType!.canBeUndefined).toBe(false)

    const postBInputId = postB.args[0].properties.find(
      (it) => it.propertyName === "id",
    )!
    expect(postBInputId.nullable).toBe(false)
    expect(postBInputId.canBeUndefined).toBe(true)

    const postC = result.queries.find((it) => it.propertyName === "postC")!
    expect(postC.returnType).not.toBe(undefined)
    expect(postC.returnType!.nullable).toBe(true)
    expect(postC.returnType!.canBeUndefined).toBe(true)

    const postCInputId = postC.args[0].properties.find(
      (it) => it.propertyName === "id",
    )!
    expect(postCInputId.nullable).toBe(true)
    expect(postCInputId.canBeUndefined).toBe(true)
  })

  test("input type", () => {
    const postsA = result.queries.find((it) => it.propertyName === "postsA")!
    expect(postsA.returnType).not.toBe(undefined)
    expect(postsA.returnType!.nullable).toBe(false)
    expect(postsA.returnType!.canBeUndefined).toBe(false)

    expect(postsA.args[0].nullable).toBe(false)
    expect(postsA.args[0].canBeUndefined).toBe(false)

    const postsB = result.queries.find((it) => it.propertyName === "postsB")!
    expect(postsB.returnType).not.toBe(undefined)
    expect(postsB.returnType!.nullable).toBe(false)
    expect(postsB.returnType!.canBeUndefined).toBe(true)
    expect(postsB.returnType!.array).toBe(true)

    expect(postsB.args[0].nullable).toBe(false)
    expect(postsB.args[0].canBeUndefined).toBe(true)

    const postsC = result.queries.find((it) => it.propertyName === "postsC")!
    expect(postsC.returnType).not.toBe(undefined)
    expect(postsC.returnType!.nullable).toBe(true)
    expect(postsC.returnType!.canBeUndefined).toBe(false)
    expect(postsC.returnType!.array).toBe(true)

    expect(postsC.args[0].nullable).toBe(true)
    expect(postsC.args[0].canBeUndefined).toBe(false)

    const postsD = result.queries.find((it) => it.propertyName === "postsD")!
    expect(postsD.returnType).not.toBe(undefined)
    expect(postsD.returnType!.nullable).toBe(true)
    expect(postsD.returnType!.canBeUndefined).toBe(true)
    expect(postsD.returnType!.array).toBe(true)

    expect(postsD.args[0].nullable).toBe(true)
    expect(postsD.args[0].canBeUndefined).toBe(true)
  })
})
