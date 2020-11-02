import * as requestFns from "@microframework/core/_/request/request-functions"
import * as validationFns from "@microframework/core/_/validation/validation-functions"
import * as resolverFns from "@microframework/core/_/resolver/resolver-function"
import {
  action,
  AnyRequestAction,
  createApp,
  RequestMap,
} from "@microframework/core"

describe("core > application > factory", () => {
  describe("createApp", () => {
    test("must return an Application type", () => {
      const app = createApp()
      expect(app["@type"]).toBe("Application")
      expect(app.model).toBeDefined()
      expect(app.input).toBeDefined()
      expect(app.query).toBeDefined()
      expect(app.mutation).toBeDefined()
      expect(app.subscription).toBeDefined()
      expect(app.action).toBeDefined()
      expect(app.request).toBeDefined()
      expect(app.validationRule).toBeDefined()
      expect(app.resolver).toBeDefined()
      expect(app.contextResolver).toBeDefined()
    })
    test(".model call should work as expected", () => {
      const app = createApp<{
        models: {
          User: {
            id: number
            firstName: string
            age: number
          }
        }
      }>()
      // this is undefined because type is "virtual", used for compilation purposes
      expect(app.model("User").type).toBe(undefined)

      // this should be equal to the model name defined in the "key" of ModelList
      expect(app.model("User").name).toBe("User")

      // here we expect a compilation error since such model isn't registered in the app
      // @ts-expect-error
      app.model("Post")

      // create some non-executable code to make type assertions
      // we don't execute this code because "type" in the model is not defined in the runtime
      const fakeFn1 = () => app.model("User").type.id
      const fakeFn2 = () => app.model("User").type.age
      const fakeFn3 = () => app.model("User").type.firstName

      // and finally property that doesn't exist in the model and should throw a compilation error
      // @ts-expect-error
      const fakeFn4 = () => app.model("User").type.secondName
    })
    test(".input call should work as expected", () => {
      const app = createApp<{
        inputs: {
          UserInput: {
            firstName: string
            age: number
          }
        }
      }>()
      // this is undefined because type is "virtual", used for compilation purposes
      expect(app.input("UserInput").type).toBe(undefined)

      // this should be equal to the input name defined in the "key" of InputList
      expect(app.input("UserInput").name).toBe("UserInput")

      // here we expect a compilation error since such input isn't registered in the app
      // @ts-expect-error
      app.input("PhotoInput")

      // create some non-executable code to make type assertions
      // we don't execute this code because "type" in the model is not defined in the runtime
      const fakeFn1 = () => app.input("UserInput").type.age
      const fakeFn2 = () => app.input("UserInput").type.firstName

      // and finally property that doesn't exist in the model and should throw a compilation error
      // @ts-expect-error
      const fakeFn3 = () => app.input("UserInput").type.secondName
    })
    test(".action call should delegate to standalone action() fn", () => {
      const app = createApp<{
        actions: {
          "GET /users": {
            return: {
              id: number
              name: string
            }[]
          }
        }
      }>()

      // make sure standalone request function "action" was called properly
      jest.spyOn(requestFns, "action")
      app.action("GET /users")
      expect(requestFns.action).toHaveBeenCalledWith(app, "GET /users")

      // here we expect a compilation error since such action isn't registered in the app
      // @ts-expect-error
      app.action("/photos")
    })
    test(".query call should delegate to standalone query() fn", () => {
      type User = {
        id: number
        name: string
      }

      const app = createApp<{
        models: {
          User: User
        }
        queries: {
          users(input: { take: number }): User[]
        }
      }>()

      // make sure standalone request function "query" was called properly
      jest.spyOn(requestFns, "query")
      app.query("users", {
        input: {
          take: 10,
        },
        select: {
          id: true,
          name: true,
        },
      })
      expect(requestFns.query).toHaveBeenCalledWith(app, "users", {
        input: {
          take: 10,
        },
        select: {
          id: true,
          name: true,
        },
      })

      // here we expect a compilation error since such mutation isn't registered in the app
      // @ts-expect-error
      app.query("photos", {
        input: {
          take: 10,
        },
        select: {
          id: true,
          name: true,
        },
      })
    })
    test(".mutation call should delegate to standalone mutation() fn", () => {
      type User = {
        id: number
        name: string
      }

      const app = createApp<{
        models: {
          User: User
        }
        mutations: {
          createUser(input: { name: string }): User
        }
      }>()

      // make sure standalone request function "mutation" was called properly
      jest.spyOn(requestFns, "mutation")
      app.mutation("createUser", {
        input: {
          name: "Timber",
        },
        select: {
          id: true,
          name: true,
        },
      })
      expect(requestFns.mutation).toHaveBeenCalledWith(app, "createUser", {
        input: {
          name: "Timber",
        },
        select: {
          id: true,
          name: true,
        },
      })

      // here we expect a compilation error since such mutation isn't registered in the app
      // @ts-expect-error
      app.mutation("createPhoto", {
        input: {
          name: "Timber",
        },
        select: {
          id: true,
          name: true,
        },
      })
    })
    test(".subscription call should delegate to standalone subscription() fn", () => {
      type User = {
        id: number
        name: string
      }

      const app = createApp<{
        models: {
          User: User
        }
        subscriptions: {
          onUserCreate(): User
        }
      }>()

      // make sure standalone request function "subscription" was called properly
      jest.spyOn(requestFns, "subscription")
      app.subscription("onUserCreate", {
        select: {
          id: true,
          name: true,
        },
      })
      expect(requestFns.subscription).toHaveBeenCalledWith(
        app,
        "onUserCreate",
        {
          select: {
            id: true,
            name: true,
          },
        },
      )

      // here we expect a compilation error since such subscription isn't registered in the app
      // @ts-expect-error
      app.subscription("onPhotoCreate", {
        select: {
          id: true,
          name: true,
        },
      })
    })
    test(".request call should delegate to standalone request() fn", () => {
      type User = {
        id: number
        name: string
      }

      const app = createApp<{
        models: {
          User: User
        }
        queries: {
          users(): User[]
        }
      }>()

      // todo: provide a proper typing for RequestMap
      const requestMap: RequestMap = {
        users: app.query("users", {
          select: {
            id: true,
          },
        }),
      }

      // make sure standalone request function "request" was called properly
      jest.spyOn(requestFns, "request")
      app.request("UsersRequest", requestMap)
      expect(requestFns.request).toHaveBeenCalledWith(
        "UsersRequest",
        requestMap,
      )
    })
    test(".validationRule call should delegate to standalone validationRule() fn", () => {
      type User = {
        id: number
        email: string
      }

      const app = createApp<{
        models: {
          User: User
        }
        queries: {
          users(): User[]
        }
      }>()

      // make sure standalone request function "validationRule" was called properly
      jest.spyOn(validationFns, "validationRule")
      app.validationRule("User", {
        projection: {
          id: {
            positive: true,
          },
          email: {
            isEmail: true,
          },
        },
      })
      expect(validationFns.validationRule).toHaveBeenCalledWith(app, "User", {
        projection: {
          id: {
            positive: true,
          },
          email: {
            isEmail: true,
          },
        },
      })
    })
    test(".resolver call should delegate to standalone resolver() fn", () => {
      type User = {
        id: number
        email: string
      }

      const app = createApp<{
        models: {
          User: User
        }
        queries: {
          users(): User[]
        }
      }>()

      const userModelResolver = {
        id() {
          return 1
        },
        email() {
          return "timber-saw@example.com"
        },
      }

      // make sure standalone request function "resolver" was called properly
      jest.spyOn(resolverFns, "resolver")
      app.resolver({ name: "User" }, userModelResolver)
      expect(resolverFns.resolver).toHaveBeenCalledWith(
        app,
        { name: "User" },
        userModelResolver,
      )
    })
    test(".contextResolver call should delegate to standalone contextResolver() fn", () => {
      type User = {
        id: number
        name: string
      }

      const app = createApp<{
        models: {
          User: User
        }
        queries: {
          users(): User[]
        }
        context: {
          currentUser: User
        }
      }>()

      const resolver = {
        currentUser() {
          return {
            id: 1,
            name: "Timber",
          }
        },
      }

      // make sure standalone request function "contextResolver" was called properly
      jest.spyOn(resolverFns, "contextResolver")
      app.contextResolver(resolver)
      expect(resolverFns.contextResolver).toHaveBeenCalledWith(app, resolver)

      // here we expect a compilation error because property isn't registered in the app context
      app.contextResolver({
        // @ts-expect-error
        currentPhoto() {},
      })
    })
  })
})
