import { assign, destruct, service } from "@microframework/core"

describe("core > util", () => {
  test("assign", () => {
    type User = {
      id: number
      firstName: string
      lastName: string
      age?: number
    }
    const user: User = {
      id: 1,
      firstName: "Nature's",
      lastName: "Prophet",
    }
    assign(user, {
      age: 30,
    })
    expect(user).toEqual({
      id: 1,
      firstName: "Nature's",
      lastName: "Prophet",
      age: 30,
    })

    // here we expect a compilation error because there is no "nickname" property in a User type
    assign(user, {
      // @ts-expect-error
      nickname: "Furion",
    })
  })
  describe("destruct", () => {
    test("literal", async () => {
      const PersonLiteral = {
        id: 1,
        firstName: "Timber",
        lastName: "Saw",
        fullName() {
          return this.firstName + " " + this.lastName
        },
      }

      const { id, fullName } = destruct(PersonLiteral)
      expect(id).toEqual(1)
      expect(fullName()).toEqual("Timber Saw")
    })
    test("class", async () => {
      class PersonCls {
        id = 1
        firstName = "Timber"
        lastName = "Saw"
        fullName() {
          return this.firstName + " " + this.lastName
        }
      }

      const { id, fullName } = destruct(new PersonCls())
      expect(id).toEqual(1)
      expect(fullName()).toEqual("Timber Saw")
    })
    test("anonymous class", async () => {
      const PersonCls = class {
        id = 1
        firstName = "Timber"
        lastName = "Saw"
        fullName() {
          return this.firstName + " " + this.lastName
        }
      }

      const { id, fullName } = destruct(new PersonCls())
      expect(id).toEqual(1)
      expect(fullName()).toEqual("Timber Saw")
    })
  })
  test("service", () => {
    const CarFactory = service(
      class {
        build() {
          return [
            { id: 1, name: "Model X" },
            { id: 2, name: "Model Y" },
            { id: 3, name: "Model Z" },
          ]
        }
      },
    )

    expect(CarFactory.build()).toEqual([
      { id: 1, name: "Model X" },
      { id: 2, name: "Model Y" },
      { id: 3, name: "Model Z" },
    ])
  })
})
