import {
  Action,
  createApp,
  DeclarationKeys,
  DeclarationTypes,
  GraphQLDeclarationItem,
  GraphQLDeclarationItemReturnType,
} from "@microframework/core"

describe("core > application > helper types", () => {
  test("GraphQLDeclarationItem", async () => {
    const type1: GraphQLDeclarationItem<{}> = () => 1
    const type2: GraphQLDeclarationItem<{}> = () => "some string"
    const type3: GraphQLDeclarationItem<{}> = () => true
    const type4: GraphQLDeclarationItem<{}> = () => ({ name: "something" })
    const type5: GraphQLDeclarationItem<{ name: string }> = (args) => ({
      name: args.name,
    })
    // @ts-expect-error
    const error1: GraphQLDeclarationItem<{}> = "some string"
    // @ts-expect-error
    const error2: GraphQLDeclarationItem<{}> = null
    // @ts-expect-error
    const error3: GraphQLDeclarationItem<{}> = undefined
    // @ts-expect-error
    const error4: GraphQLDeclarationItem<{}> = (args) => args.something
  })
  test("GraphQLDeclarationItemReturnType", async () => {
    const type1: GraphQLDeclarationItemReturnType = 1
    const type2: GraphQLDeclarationItemReturnType = true
    const type3: GraphQLDeclarationItemReturnType = false
    const type4: GraphQLDeclarationItemReturnType = undefined
    const type5: GraphQLDeclarationItemReturnType = null
    const type6: GraphQLDeclarationItemReturnType = "some value"
    const type7: GraphQLDeclarationItemReturnType = {
      someProperty: "someValue",
    }
    // @ts-expect-error
    const error1: GraphQLDeclarationItemReturnType = Symbol("waaat")
  })
  test("Action", async () => {
    type actionType = Action<
      string[],
      { id: number },
      { sortBy: string },
      { Authorization: string },
      {},
      { firstName: string; lastName: string }
    >
    const test1: actionType = {
      return: ["a", "b", "c", "d"],
      body: {
        firstName: "Natures",
        lastName: "Prophet",
      },
      headers: {
        Authorization: "Basic 1",
      },
      params: {
        id: 1,
      },
      query: {
        sortBy: "name",
      },
      cookies: {},
    }
    const test2: actionType = {
      // @ts-expect-error
      return: ["a", "b", "c", "d", 1],
      body: {
        firstName: "Natures",
        // @ts-expect-error
        lastName: true,
      },
      headers: {
        // @ts-expect-error
        AuthorizationWow: "Basic 1",
      },
      params: {
        id: 1,
        // @ts-expect-error
        secondId: "1",
      },
      query: {
        sortBy: "name",
        // @ts-expect-error
        order: undefined,
      },
      cookies: {},
    }
  })
  test("DeclarationKeys", async () => {
    const app = createApp<{
      actions: {
        "get /users": {
          return: string[]
        }
      }
      queries: {
        userIds(): string[]
      }
      mutations: {
        userSave(args: { name: string }): number
        userRemove(args: { id: number }): boolean
      }
      subscriptions: {
        onUserRegister(): string
      }
    }>()
    type options = typeof app["_options"]
    type declarationKeys = DeclarationKeys<options>

    const test1: declarationKeys = "userIds"
    const test2: declarationKeys = "get /users"
    const test3: declarationKeys = "userSave"
    const test4: declarationKeys = "userRemove"
    const test5: declarationKeys = "onUserRegister"
    // @ts-expect-error
    const test6: declarationKeys = "users"
    // @ts-expect-error
    const test7: declarationKeys = "userSaveSomething"
    // @ts-expect-error
    const test8: declarationKeys = "post /users"
    // @ts-expect-error
    const test9: declarationKeys = "onUserRemove"
  })
  test("DeclarationTypes", async () => {
    const test1: DeclarationTypes = "queries"
    const test2: DeclarationTypes = "mutations"
    const test3: DeclarationTypes = "subscriptions"
    const test4: DeclarationTypes = "actions"
    // @ts-expect-error
    const test5: DeclarationTypes = "context"
  })
})
