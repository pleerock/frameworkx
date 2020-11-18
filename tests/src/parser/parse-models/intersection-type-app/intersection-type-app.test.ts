import { parse } from "@microframework/parser"

describe("parse models > intersection type app", () => {
  test("model defined as intersection type", () => {
    const result = parse(__dirname + "/intersection-type-app.ts")
    const intersectionType = result.models.find(
      (it) => it.typeName === "PersonIntersectionType",
    )
    expect(intersectionType).not.toBe(undefined)

    const id = intersectionType!.properties.find(
      (it) => it.propertyName === "id",
    )
    expect(id).not.toBe(undefined)
    expect(id!.kind).toBe("number")

    const name = intersectionType!.properties.find(
      (it) => it.propertyName === "name",
    )
    expect(name).not.toBe(undefined)
    expect(name!.kind).toBe("string")

    const aboutMe = intersectionType!.properties.find(
      (it) => it.propertyName === "aboutMe",
    )
    expect(aboutMe).not.toBe(undefined)
    expect(aboutMe!.kind).toBe("string")
    expect(aboutMe!.canBeUndefined).toBe(true)

    const photoUrl = intersectionType!.properties.find(
      (it) => it.propertyName === "photoUrl",
    )
    expect(photoUrl).not.toBe(undefined)
    expect(photoUrl!.kind).toBe("string")
    expect(photoUrl!.nullable).toBe(true)

    const degree = intersectionType!.properties.find(
      (it) => it.propertyName === "degree",
    )
    expect(degree).not.toBe(undefined)
    expect(degree!.kind).toBe("string")

    const graduated = intersectionType!.properties.find(
      (it) => it.propertyName === "graduated",
    )
    expect(graduated).not.toBe(undefined)
    expect(graduated!.kind).toBe("boolean")

    const workingPlace = intersectionType!.properties.find(
      (it) => it.propertyName === "workingPlace",
    )
    expect(workingPlace).not.toBe(undefined)
    expect(workingPlace!.kind).toBe("string")

    const seekingForJob = intersectionType!.properties.find(
      (it) => it.propertyName === "seekingForJob",
    )
    expect(seekingForJob).not.toBe(undefined)
    expect(seekingForJob!.kind).toBe("boolean")

    const english = intersectionType!.properties.find(
      (it) => it.propertyName === "english",
    )
    expect(english).not.toBe(undefined)
    expect(english!.kind).toBe("boolean")

    const tajik = intersectionType!.properties.find(
      (it) => it.propertyName === "tajik",
    )
    expect(tajik).not.toBe(undefined)
    expect(tajik!.kind).toBe("boolean")
  })
})
