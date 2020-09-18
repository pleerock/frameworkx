import { destruct } from "@microframework/core"

describe("core > util", () => {
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
})
