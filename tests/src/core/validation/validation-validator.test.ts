import {
  NumberValidationConstraints,
  StringValidationConstraints,
  Validator,
} from "@microframework/core"

describe("core > validation > validator", () => {
  describe("Validator (sync)", () => {
    const demoValidator: Validator = (options) => {
      if (typeof options.value === "number") {
        const constraints = options.constraints as NumberValidationConstraints
        if (constraints.lessThan !== undefined) {
          if (options.value >= constraints.lessThan)
            throw new Error(`Validation failed for ${options.key}`)
        }
      } else if (typeof options.value === "string") {
        const constraints = options.constraints as StringValidationConstraints
        if (constraints.contains !== undefined) {
          if (options.value.indexOf(constraints.contains) === -1)
            throw new Error(`Validation failed for ${options.key}`)
        }
      }
    }

    test("validator should finish successful if constraints are passed", () => {
      expect(() =>
        demoValidator({
          key: "demo1",
          value: "hello world",
          constraints: {
            contains: "hello",
          },
        }),
      ).not.toThrowError()
      expect(() =>
        demoValidator({
          key: "demo2",
          value: 99,
          constraints: {
            lessThan: 100,
          },
        }),
      ).not.toThrowError()
    })

    test("validator should throw an error if constraints aren't passed", () => {
      expect(() =>
        demoValidator({
          key: "demo1",
          value: "hello world",
          constraints: {
            contains: "bye",
          },
        }),
      ).toThrowError(`Validation failed for demo1`)
      expect(() =>
        demoValidator({
          key: "demo2",
          value: 100,
          constraints: {
            lessThan: 100,
          },
        }),
      ).toThrowError(`Validation failed for demo2`)
    })
  })
  describe("Validator (async)", () => {
    const demoValidator: Validator = async (options) => {
      if (typeof options.value === "number") {
        const constraints = options.constraints as NumberValidationConstraints
        if (constraints.lessThan !== undefined) {
          if (options.value >= constraints.lessThan)
            throw new Error(`Validation failed for ${options.key}`)
        }
      } else if (typeof options.value === "string") {
        const constraints = options.constraints as StringValidationConstraints
        if (constraints.contains !== undefined) {
          if (options.value.indexOf(constraints.contains) === -1)
            throw new Error(`Validation failed for ${options.key}`)
        }
      }
    }

    test("validator should finish successful if constraints are passed", async () => {
      await expect(
        demoValidator({
          key: "demo1",
          value: "hello world",
          constraints: {
            contains: "hello",
          },
        }),
      ).resolves.toBeFalsy()
      await expect(
        demoValidator({
          key: "demo2",
          value: 99,
          constraints: {
            lessThan: 100,
          },
        }),
      ).resolves.toBeFalsy()
    })

    test("validator should throw an error if constraints aren't passed", async () => {
      await expect(
        demoValidator({
          key: "demo1",
          value: "hello world",
          constraints: {
            contains: "bye",
          },
        }),
      ).rejects.toThrowError(`Validation failed for demo1`)
      await expect(
        demoValidator({
          key: "demo2",
          value: 100,
          constraints: {
            lessThan: 100,
          },
        }),
      ).rejects.toThrowError(`Validation failed for demo2`)
    })
  })
})
