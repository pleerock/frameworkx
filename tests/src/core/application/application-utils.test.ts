import { ApplicationUtils } from "@microframework/core"

describe("core > application > utils", () => {
  describe("mixedListToArray", () => {
    test("array should be returned as an array", () => {
      const result = ApplicationUtils.mixedListToArray([1, 2, 3])
      expect(result).toEqual([1, 2, 3])
    })
    test("object should be returned as an array as well", () => {
      const result = ApplicationUtils.mixedListToArray({
        1: 1,
        2: 2,
        3: 3,
      })
      expect(result).toEqual([1, 2, 3])
    })
  })
})
