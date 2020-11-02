import {
  Application,
  ContextResolver,
  DeclarationResolver,
  ModelDLResolver,
  ModelResolver,
} from "@microframework/core"

describe("core > resolver > strategy", () => {
  describe("ModelResolver", () => {
    type User = {
      id: number
      name: string
      isOnline: boolean
      address: string | null
      nickname?: string
    }
    type SomeContext = {
      onlineUsers: User[]
    }
    test("all implemented properties", () => {
      const resolver1: ModelResolver<User, SomeContext> = {
        id() {
          return 1
        },
        name() {
          return "Timber"
        },
        isOnline(user, _, context) {
          return context.onlineUsers.some(
            (onlineUser) => onlineUser.id === user.id,
          )
        },
      }
      const resolver2: ModelResolver<User, SomeContext> = {
        async id() {
          return 1
        },
        async name() {
          return "Timber"
        },
        async isOnline(user, _, context) {
          return context.onlineUsers.some(
            (onlineUser) => onlineUser.id === user.id,
          )
        },
      }
    })
    test("partially implemented properties", () => {
      const resolver1: ModelResolver<User, SomeContext> = {
        id() {
          return 1
        },
        name() {
          return "Timber"
        },
      }
      const resolver2: ModelResolver<User, SomeContext> = {
        async id() {
          return 1
        },
        async name() {
          return "Timber"
        },
      }
    })
    test("model property return types should match", () => {
      const resolver1: ModelResolver<User, SomeContext> = {
        // @ts-ignore-error
        id() {
          return "1"
        },
        // @ts-ignore-error
        name() {
          return 123
        },
        isOnline() {
          return false
        },
      }
      const resolver2: ModelResolver<User, SomeContext> = {
        // @ts-ignore-error
        async id() {
          return "1"
        },
        // @ts-ignore-error
        async name() {
          return 123
        },
        async isOnline() {
          return false
        },
      }
    })
    test("model property return types should support nulls properly", () => {
      const resolver1: ModelResolver<User, SomeContext> = {
        // @ts-ignore-error
        id() {
          return [1]
        },
        // @ts-ignore-error
        name() {
          return null
        },
        // @ts-ignore-error
        isOnline() {
          return undefined
        },
        address() {
          return null
        },
        nickname() {
          return undefined
        },
      }
      const resolver2: ModelResolver<User, SomeContext> = {
        async id() {
          return 1
        },
        // @ts-ignore-error
        async name() {
          return null
        },
        // @ts-ignore-error
        async isOnline() {
          return undefined
        },
        async address() {
          return null
        },
        async nickname() {
          return undefined
        },
      }
    })
    test("parent argument should work properly", () => {
      const resolver1: ModelResolver<User> = {
        id(user, _, context) {
          user.id
          user.nickname
          user.address
          user.isOnline
          return 1
        },
      }
      const resolver2: ModelResolver<User> = {
        async id(user, _, context) {
          user.id
          user.nickname
          user.address
          user.isOnline
          return 1
        },
      }
    })
    test("context should be typed properly", () => {
      const resolver1: ModelResolver<User> = {
        id(user, _, context) {
          context.request
          context.response
          context.logger.log("hello")
          // @ts-expect-error
          context.someProperty
          return 1
        },
      }
      const resolver2: ModelResolver<User, SomeContext> = {
        id(user, _, context) {
          context.request
          context.response
          context.logger.log("hello")
          context.onlineUsers
          // @ts-expect-error
          context.someProperty
          return 1
        },
      }
      const resolver3: ModelResolver<User> = {
        async id(user, _, context) {
          context.request
          context.response
          context.logger.log("hello")
          // @ts-expect-error
          context.someProperty
          return 1
        },
      }
      const resolver4: ModelResolver<User, SomeContext> = {
        async id(user, _, context) {
          context.request
          context.response
          context.logger.log("hello")
          context.onlineUsers
          // @ts-expect-error
          context.someProperty
          return 1
        },
      }
    })
  })
  describe("ModelDLResolver", () => {
    type User = {
      id: number
      name: string
      isOnline: boolean
      address: string | null
      nickname?: string
    }
    type SomeContext = {
      onlineUsers: User[]
    }
    test("all implemented properties", () => {
      const resolver1: ModelDLResolver<User, SomeContext> = {
        id() {
          return [1]
        },
        name() {
          return ["Timber"]
        },
        isOnline(users, _, context) {
          return [
            context.onlineUsers.some(
              (onlineUser) => onlineUser.id === users[0].id,
            ),
          ]
        },
      }
      const resolver2: ModelDLResolver<User, SomeContext> = {
        async id() {
          return [1]
        },
        async name() {
          return ["Timber"]
        },
        async isOnline(users, _, context) {
          return [
            context.onlineUsers.some(
              (onlineUser) => onlineUser.id === users[0].id,
            ),
          ]
        },
      }
    })
    test("partially implemented properties", () => {
      const resolver1: ModelDLResolver<User, SomeContext> = {
        id() {
          return [1]
        },
        name() {
          return ["Timber"]
        },
      }
      const resolver2: ModelDLResolver<User, SomeContext> = {
        async id() {
          return [1]
        },
        async name() {
          return ["Timber"]
        },
      }
    })
    test("model property return types should match", () => {
      const resolver1: ModelDLResolver<User, SomeContext> = {
        // @ts-ignore-error
        id() {
          return ["1"]
        },
        // @ts-ignore-error
        name() {
          return [123]
        },
        isOnline() {
          return [false]
        },
      }
      const resolver2: ModelDLResolver<User, SomeContext> = {
        // @ts-ignore-error
        async id() {
          return ["1"]
        },
        // @ts-ignore-error
        async name() {
          return [123]
        },
        async isOnline() {
          return [false]
        },
      }
    })
    test("model property return types should support nulls properly", () => {
      const resolver1: ModelDLResolver<User, SomeContext> = {
        // @ts-ignore-error
        id() {
          return 1
        },
        // @ts-ignore-error
        name() {
          return [null]
        },
        // @ts-ignore-error
        isOnline() {
          return [undefined]
        },
        address() {
          return [null]
        },
        nickname() {
          return [undefined]
        },
      }
      const resolver2: ModelDLResolver<User, SomeContext> = {
        // @ts-ignore-error
        async id() {
          return 1
        },
        // @ts-ignore-error
        async name() {
          return [null]
        },
        // @ts-ignore-error
        async isOnline() {
          return [undefined]
        },
        async address() {
          return [null]
        },
        async nickname() {
          return [undefined]
        },
      }
    })
    test("parent argument should work properly", () => {
      const resolver1: ModelDLResolver<User> = {
        id(users, _, context) {
          users[0].id
          users[0].nickname
          users[0].address
          users[0].isOnline
          return [1]
        },
      }
      const resolver2: ModelDLResolver<User> = {
        async id(users, _, context) {
          users[0].id
          users[0].nickname
          users[0].address
          users[0].isOnline
          return [1]
        },
      }
    })
    test("context should be typed properly", () => {
      const resolver1: ModelDLResolver<User> = {
        id(users, _, context) {
          context.request
          context.response
          context.logger.log("hello")
          // @ts-expect-error
          context.someProperty
          return [1]
        },
      }
      const resolver2: ModelDLResolver<User, SomeContext> = {
        id(users, _, context) {
          context.request
          context.response
          context.logger.log("hello")
          context.onlineUsers
          // @ts-expect-error
          context.someProperty
          return [1]
        },
      }
      const resolver3: ModelDLResolver<User> = {
        async id(users, _, context) {
          context.request
          context.response
          context.logger.log("hello")
          // @ts-expect-error
          context.someProperty
          return [1]
        },
      }
      const resolver4: ModelDLResolver<User, SomeContext> = {
        async id(users, _, context) {
          context.request
          context.response
          context.logger.log("hello")
          context.onlineUsers
          // @ts-expect-error
          context.someProperty
          return [1]
        },
      }
    })
    describe("ContextResolver", () => {
      type User = {
        id: number
        name: string
        isOnline: boolean
      }
      type UserContext = {
        onlineUsers: User[]
      }
      test("basic usage", () => {
        const resolver1: ContextResolver<UserContext> = {
          onlineUsers() {
            return [
              { id: 1, name: "Timber", isOnline: true },
              { id: 2, name: "Nature's", isOnline: true },
            ]
          },
        }
        const resolver2: ContextResolver<UserContext> = {
          async onlineUsers() {
            return [
              { id: 1, name: "Timber", isOnline: true },
              { id: 2, name: "Nature's", isOnline: true },
            ]
          },
        }
        const resolver3: ContextResolver<UserContext> = {
          // type mismatch, thus expect an error
          // @ts-ignore-error
          async onlineUsers() {
            return { id: 1, name: "Timber", isOnline: true }
          },
        }
      })
      test("default context should be accessible", () => {
        const resolver1: ContextResolver<UserContext> = {
          onlineUsers(defaultContext) {
            defaultContext.request
            defaultContext.response
            defaultContext.logger.log("hello")
            // @ts-expect-error
            defaultContext.someProperty
            return [
              { id: 1, name: "Timber", isOnline: true },
              { id: 2, name: "Nature's", isOnline: true },
            ]
          },
        }
      })
    })
    describe("DeclarationResolver", () => {
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
          removeUser(input: { id: number }): boolean
        }
        subscriptions: {
          onUserSave(): User
        }
        actions: {
          "POST /login": {
            return: User
            body: {
              login: string
              password: string
            }
          }
        }
        context: {
          onlineUsers: User[]
        }
      }>
      test("basic usage", () => {
        const resolver1: DeclarationResolver<UserApp> = {
          users() {
            return [{ id: 1, name: "Timber", isOnline: false }]
          },
        }
      })
      test("return type must be type validated", () => {
        const resolver1: DeclarationResolver<UserApp> = {
          // @ts-expect-error
          users() {
            return { id: 1, name: "Timber", isOnline: false }
          },

          // let's just make one correct case
          user() {
            return { id: 1, name: "Timber", isOnline: false }
          },

          // @ts-expect-error
          saveUser() {
            return true
          },

          // @ts-expect-error
          removeUser() {
            return 1
          },
        }
      })
      test("in queries / mutations / subscriptions return type can be partial", () => {
        const resolver1: DeclarationResolver<UserApp> = {
          users() {
            return [{ name: "Timber" }]
          },
          saveUser() {
            return {
              id: 1,
            }
          },
        }
      })
      test("it should be possible to return null for nullable queries / mutations", () => {
        const resolver1: DeclarationResolver<UserApp> = {
          user() {
            return null
          },
        }
        const resolver2: DeclarationResolver<UserApp> = {
          async user() {
            return null
          },
        }
        const resolver3: DeclarationResolver<UserApp> = {
          async user() {
            return { name: "Timber" }
          },
        }
      })
      test("it should be possible to return undefined for nullable queries / mutations", () => {
        const resolver1: DeclarationResolver<UserApp> = {
          user() {
            return undefined
          },
        }
        const resolver2: DeclarationResolver<UserApp> = {
          async user() {
            return undefined
          },
        }
        const resolver3: DeclarationResolver<UserApp> = {
          async user() {
            return { name: "Timber" }
          },
        }
      })
      test("if query / mutation isn't nullable we should not be able to return null", () => {
        const resolver1: DeclarationResolver<UserApp> = {
          // @ts-expect-error
          users() {
            return null
          },
        }
      })
      test("if query / mutation isn't nullable we should not be able to return undefined", () => {
        const resolver1: DeclarationResolver<UserApp> = {
          // @ts-expect-error
          users() {
            return undefined
          },
        }
      })
      test("actions should be typed", () => {
        const resolver1: DeclarationResolver<UserApp> = {
          // @ts-expect-error
          ["POST /login"]() {
            return {
              id: 1,
              name: "Timber",
            }
          },
        }
      })
      test("complete usage", () => {
        const resolver1: DeclarationResolver<UserApp> = {
          users() {
            return [
              { id: 1, name: "Timber", isOnline: true },
              { id: 2, name: "Nature's", isOnline: true },
            ]
          },
          async user() {
            return { name: "Timber" }
          },
          saveUser(input) {
            return {
              id: 0,
              name: input.name,
            }
          },
          ["POST /login"]() {
            return {
              id: 1,
              name: "Timber",
              isOnline: false,
            }
          },
          onUserSave: {
            triggers: ["ON_USER_SAVE"],
          },
        }
      })
    })
  })
})
