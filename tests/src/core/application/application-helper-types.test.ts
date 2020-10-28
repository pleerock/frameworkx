import {
  AnyApplication,
  AnyApplicationOptions,
  createApp,
  FlatMapType,
  ForcedType,
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
  test("ForcedType", async () => {
    // assigning anything other then string should emit error
    const onlyString: ForcedType<string, string> = "a"
    // assigning any value is acceptable because of "undefined" (because casted to "any" now)
    const alsoUndefined: ForcedType<string | undefined, string> = 1
  })
  test("FlatMapType", async () => {
    // string should be assigned to a string
    const onlyString: FlatMapType<string> = "a"

    // string array must be flatted down to a just string
    const stringEvenBeingArray: FlatMapType<string[]> = "b"

    // we don't expect it to be an array
    // @ts-expect-error
    const expectErrorWhenArrayAssigned: FlatMapType<string[]> = ["a"]
  })
  test("AnyApplication", async () => {
    const app: AnyApplication = createApp()
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
