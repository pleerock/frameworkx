import { createApp, validationRule } from "@microframework/core"
import { Model } from "@microframework/model"

describe("core > validation > functions", () => {
  describe("validationRule", () => {
    test("must return a ValidationRule type when model is given", () => {
      type User = {
        id: number
        name: string
      }
      const userModel = new Model<User>("User")
      const userModelValidationRule = validationRule(userModel, {
        projection: {
          id: {
            positive: true,
          },
        },
      })
      expect(userModelValidationRule["@type"]).toBe("ValidationRule")
      expect(userModelValidationRule.name).toBe("User")
      expect(userModelValidationRule.options).toEqual({
        projection: {
          id: {
            positive: true,
          },
        },
      })
    })
    test("must return a ValidationRule type when app's model is given", () => {
      type User = {
        id: number
        name: string
      }
      const app = createApp<{
        models: {
          User: User
        }
      }>()
      const userModelValidationRule = validationRule(app, "User", {
        projection: {
          id: {
            positive: true,
          },
        },
      })
      expect(userModelValidationRule["@type"]).toBe("ValidationRule")
      expect(userModelValidationRule.name).toBe("User")
      expect(userModelValidationRule.options).toEqual({
        projection: {
          id: {
            positive: true,
          },
        },
      })
    })
    test("must give a compilation-time error when non-exist app model was specified", () => {
      type User = {
        id: number
        name: string
      }
      const app = createApp<{
        models: {
          User: User
        }
      }>()
      validationRule(app, "User", {})
      // @ts-expect-error
      validationRule(app, "Photo", {})
    })
  })
})
