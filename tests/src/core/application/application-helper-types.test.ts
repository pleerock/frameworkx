import {
  AnyApplication,
  AnyApplicationOptions,
  Application,
  ApplicationOptions,
  LiteralOrClass,
  MixedList,
  NonArray,
  ReturnTypeOptional,
} from "@microframework/core"

describe("core > application > helper types", () => {
  test("MixedList", async () => {
    const stringMixedListArray: MixedList<string> = ["hello", "world"]
    const stringMixedListObject: MixedList<string> = {
      first: "hello",
      second: "world",
    }
    const numberMixedListArrayTest: MixedList<number> = [2, 4, 6]
    const numberMixedListObjectTest: MixedList<number> = {
      two: 2,
      four: 4,
      six: 6,
    }
  })
  test("NonArray", async () => {
    const string: NonArray<string> = "this is not an array"
    const stringArray: NonArray<string[]> = "this is not an array"
    const number: NonArray<number> = 123
    const numberArray: NonArray<number[]> = 123
  })
  test("ReturnTypeOptional", async () => {
    const fnString: ReturnTypeOptional<() => string> = "this should be a string"
    const string: ReturnTypeOptional<string> = "this should be a string as well"
  })
  test("LiteralOrClass", async () => {
    class TestForLiteralOrClass {
      hello = "world"
    }
    const literal: LiteralOrClass<{
      hello: string
    }> = {
      hello: "world",
    }
    const cls: LiteralOrClass<TestForLiteralOrClass> = {
      hello: "world",
    }
  })
  test("AnyApplication", async () => {
    const app: AnyApplication = new Application()
  })
  test("AnyApplicationOptions", async () => {
    const options: AnyApplicationOptions = {
      actions: {},
      queries: {},
      mutations: {},
      subscriptions: {},
      context: {},
    }
  })
})
