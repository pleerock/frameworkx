import { ValidationError } from "@microframework/core"
import { createValidationError } from "@microframework/validator/_/validator-utils"

describe("validator > utils", () => {
  describe("createValidationError", () => {
    test("should return ValidationError instance", () => {
      expect(createValidationError("someProperty", "isBase64")).toBeInstanceOf(
        ValidationError,
      )
    })
    test("message should contain a key and validation error code", () => {
      expect(createValidationError("property", "isBase64").toString()).toEqual(
        'Error: Validation error: property ("isBase64")',
      )
    })
    test("message validation without key specified should contain just error code", () => {
      expect(createValidationError(undefined, "isBase64").toString()).toEqual(
        'Error: Validation error: ("isBase64")',
      )
    })
  })
})
