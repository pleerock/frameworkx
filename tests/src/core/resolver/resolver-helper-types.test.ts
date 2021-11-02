import {
  Application,
  DefaultContext,
  InputOf,
  ResolverReturnValue,
} from "@microframework/core"

describe("core > resolver > helper types", () => {
  describe("DefaultContext", () => {
    test("must have all needed properties", () => {
      const assert1: DefaultContext = {
        request: undefined as any,
        response: undefined as any,
        logger: undefined as any,
      }
      assert1.request
      assert1.response
      assert1.logger
      // @ts-expect-error
      assert1.someOtherProperty
    })
  })
  describe("ResolverReturnValue", () => {
    test("string", () => {
      const assert1: ResolverReturnValue<string> = "hello"
      // @ts-expect-error
      const assert2: ResolverReturnValue<string> = null
      // @ts-expect-error
      const assert3: ResolverReturnValue<string> = undefined
      const assert4: ResolverReturnValue<string | null> = "hello"
      const assert5: ResolverReturnValue<string | null> = null
      const assert6: ResolverReturnValue<string | null> = undefined
      // @ts-expect-error
      const assert7: ResolverReturnValue<string | null> = 1
    })
    it("async string", () => {
      const assert1: ResolverReturnValue<string> = Promise.resolve("hello")
      // @ts-expect-error
      const assert2: ResolverReturnValue<string> = Promise.resolve(null)
      // @ts-expect-error
      const assert3: ResolverReturnValue<string> = Promise.resolve(undefined)
      const assert4: ResolverReturnValue<string | null> = Promise.resolve(
        "hello",
      )
      const assert5: ResolverReturnValue<string | null> = Promise.resolve(null)
      const assert6: ResolverReturnValue<string | null> = Promise.resolve(
        undefined,
      )
      // @ts-expect-error
      const assert7: ResolverReturnValue<string | null> = Promise.resolve(1)
    })
    test("boolean", () => {
      const assert1: ResolverReturnValue<boolean> = true
      // @ts-expect-error
      const assert2: ResolverReturnValue<boolean> = null
      // @ts-expect-error
      const assert3: ResolverReturnValue<boolean> = undefined
      const assert4: ResolverReturnValue<boolean | null> = false
      const assert5: ResolverReturnValue<boolean | null> = null
      const assert6: ResolverReturnValue<boolean | null> = undefined
      // @ts-expect-error
      const assert7: ResolverReturnValue<string | null> = 1
    })
    it("async boolean", () => {
      const assert1: ResolverReturnValue<boolean> = Promise.resolve(true)
      // @ts-expect-error
      const assert2: ResolverReturnValue<boolean> = Promise.resolve(null)
      // @ts-expect-error
      const assert3: ResolverReturnValue<boolean> = Promise.resolve(undefined)
      const assert4: ResolverReturnValue<boolean | null> = Promise.resolve(
        false,
      )
      const assert5: ResolverReturnValue<boolean | null> = Promise.resolve(null)
      const assert6: ResolverReturnValue<boolean | null> = Promise.resolve(
        undefined,
      )
      // @ts-expect-error
      const assert7: ResolverReturnValue<boolean | null> = Promise.resolve(1)
    })
    test("number", () => {
      const assert1: ResolverReturnValue<number> = 1
      // @ts-expect-error
      const assert2: ResolverReturnValue<number> = null
      // @ts-expect-error
      const assert3: ResolverReturnValue<number> = undefined
      const assert4: ResolverReturnValue<number | null> = 2
      const assert5: ResolverReturnValue<number | null> = null
      const assert6: ResolverReturnValue<number | null> = undefined
      // @ts-expect-error
      const assert7: ResolverReturnValue<number | null> = "1"
    })
    it("async number", () => {
      const assert1: ResolverReturnValue<number> = Promise.resolve(1)
      // @ts-expect-error
      const assert2: ResolverReturnValue<number> = Promise.resolve(null)
      // @ts-expect-error
      const assert3: ResolverReturnValue<number> = Promise.resolve(undefined)
      const assert4: ResolverReturnValue<number | null> = Promise.resolve(2)
      const assert5: ResolverReturnValue<number | null> = Promise.resolve(null)
      const assert6: ResolverReturnValue<number | null> = Promise.resolve(
        undefined,
      )
      // @ts-expect-error
      const assert7: ResolverReturnValue<number | null> = Promise.resolve("1")
    })
    test("boolean[]", () => {
      const assert1: ResolverReturnValue<boolean[]> = [true]
      // @ts-expect-error
      const assert2: ResolverReturnValue<boolean[]> = null
      // @ts-expect-error
      const assert3: ResolverReturnValue<boolean[]> = undefined
      const assert4: ResolverReturnValue<boolean[] | null> = [true]
      const assert5: ResolverReturnValue<boolean[] | null> = null
      const assert6: ResolverReturnValue<boolean[] | null> = undefined
      // @ts-expect-error
      const assert7: ResolverReturnValue<boolean[] | null> = [1]
    })
    it("async boolean[]", () => {
      const assert1: ResolverReturnValue<boolean[]> = Promise.resolve([true])
      // @ts-expect-error
      const assert2: ResolverReturnValue<boolean[]> = Promise.resolve(null)
      // @ts-expect-error
      const assert3: ResolverReturnValue<boolean[]> = Promise.resolve(undefined)
      const assert4: ResolverReturnValue<boolean[] | null> = Promise.resolve([
        true,
      ])
      const assert5: ResolverReturnValue<boolean[] | null> = Promise.resolve(
        null,
      )
      const assert6: ResolverReturnValue<boolean[] | null> = Promise.resolve(
        undefined,
      )
      // @ts-expect-error
      const assert7: ResolverReturnValue<boolean[] | null> = Promise.resolve([
        "true",
      ])
    })
    test("string[]", () => {
      const assert1: ResolverReturnValue<string[]> = ["hello"]
      // @ts-expect-error
      const assert2: ResolverReturnValue<string[]> = null
      // @ts-expect-error
      const assert3: ResolverReturnValue<string[]> = undefined
      const assert4: ResolverReturnValue<string[] | null> = ["hello"]
      const assert5: ResolverReturnValue<string[] | null> = null
      const assert6: ResolverReturnValue<string[] | null> = undefined
      // @ts-expect-error
      const assert7: ResolverReturnValue<string[] | null> = [1]
    })
    it("async string[]", () => {
      const assert1: ResolverReturnValue<string[]> = Promise.resolve(["hello"])
      // @ts-expect-error
      const assert2: ResolverReturnValue<string[]> = Promise.resolve(null)
      // @ts-expect-error
      const assert3: ResolverReturnValue<string[]> = Promise.resolve(undefined)
      const assert4: ResolverReturnValue<string[] | null> = Promise.resolve([
        "hello",
      ])
      const assert5: ResolverReturnValue<string[] | null> = Promise.resolve(
        null,
      )
      const assert6: ResolverReturnValue<string[] | null> = Promise.resolve(
        undefined,
      )
      // @ts-expect-error
      const assert7: ResolverReturnValue<string[] | null> = Promise.resolve([1])
    })
    test("number[]", () => {
      const assert1: ResolverReturnValue<number[]> = [1]
      // @ts-expect-error
      const assert2: ResolverReturnValue<number[]> = null
      // @ts-expect-error
      const assert3: ResolverReturnValue<number[]> = undefined
      const assert4: ResolverReturnValue<number[] | null> = [2]
      const assert5: ResolverReturnValue<number[] | null> = null
      const assert6: ResolverReturnValue<number[] | null> = undefined
      // @ts-expect-error
      const assert7: ResolverReturnValue<number[] | null> = ["1"]
    })
    it("async number[]", () => {
      const assert1: ResolverReturnValue<number[]> = Promise.resolve([])
      // @ts-expect-error
      const assert2: ResolverReturnValue<number[]> = Promise.resolve(null)
      // @ts-expect-error
      const assert3: ResolverReturnValue<number[]> = Promise.resolve(undefined)
      const assert4: ResolverReturnValue<number[] | null> = Promise.resolve([2])
      const assert5: ResolverReturnValue<number[] | null> = Promise.resolve(
        null,
      )
      const assert6: ResolverReturnValue<number[] | null> = Promise.resolve(
        undefined,
      )
      // @ts-expect-error
      const assert7: ResolverReturnValue<number[] | null> = Promise.resolve([
        "1",
      ])
    })
  })
  test("InputOf", () => {
    type User = {
      id: number
      name: string
      isOnline: boolean
    }
    type UserInput = {
      name: string
    }
    type UserApp = Application<{
      models: {
        User: User
      }
      inputs: {
        UserInput: UserInput
      }
      queries: {
        users(): User[]
        user(input: { id: number }): User | null
      }
      mutations: {
        saveUser(input: UserInput): User
        removeUser(input: { id: number | null }): boolean
      }
      subscriptions: {}
      actions: {}
      context: {}
    }>

    const assert1: InputOf<UserApp, "users"> = undefined
    // @ts-expect-error
    const assert2: InputOf<UserApp, "users"> = {}
    const assert3: InputOf<UserApp, "user"> = { id: 1 }
    // @ts-expect-error
    const assert4: InputOf<UserApp, "user"> = { id: "1" }
    // @ts-expect-error
    const assert5: InputOf<UserApp, "user"> = {}
    // @ts-expect-error
    const assert6: InputOf<UserApp, "user"> = null
    // @ts-expect-error
    const assert7: InputOf<UserApp, "user"> = undefined
    const assert8: InputOf<UserApp, "saveUser"> = { name: "Timber" }
    // @ts-expect-error
    const assert9: InputOf<UserApp, "saveUser"> = null
    // @ts-expect-error
    const assert10: InputOf<UserApp, "saveUser"> = undefined
    const assert11: InputOf<UserApp, "removeUser"> = { id: 1 }
    const assert12: InputOf<UserApp, "removeUser"> = { id: null }
    // @ts-expect-error
    const assert13: InputOf<UserApp, "removeUser"> = { id: "1" }
    // @ts-expect-error
    const assert14: InputOf<UserApp, "removeUser"> = null
    // @ts-expect-error
    const assert15: InputOf<UserApp, "removeUser"> = undefined
  })
})
