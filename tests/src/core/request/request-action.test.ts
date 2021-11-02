import { AnyRequestAction, createApp } from "@microframework/core"

describe("core > request > action", () => {
  describe("createApp", () => {
    test("initializing application instance", () => {
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
    test("application model should work as expected", () => {
      const app = createApp<{
        models: {
          User: {
            id: number
            firstName: string
            age: number
          }
        }
        inputs: {}
        queries: {}
        mutations: {}
        subscriptions: {}
        actions: {}
        context: {}
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
    test("application input should work as expected", () => {
      const app = createApp<{
        inputs: {
          UserInput: {
            firstName: string
            age: number
          }
        }
        models: {}
        queries: {}
        mutations: {}
        subscriptions: {}
        actions: {}
        context: {}
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
    test("application action should work as expected", () => {
      const app = createApp<{
        actions: {
          "GET /users": {
            return: {
              id: number
              name: string
            }[]
          }
          "GET /users/:id": {
            params: {
              id: number
            }
            return: {
              id: number
              name: string
            }
          }
          "POST /users": {
            body: {
              name: string
            }
            return: {
              id: number
              name: string
            }
          }
          "PUT /users/:id": {
            params: {
              id: number
            }
            body: {
              name: string
            }
            return: {
              id: number
              name: string
            }
          }
          "DELETE /users/:id": {
            params: {
              id: number
            }
            query: {
              archived: boolean
            }
            headers: {
              Authorization: string
            }
            return: {
              id: number
              name: string
            }
          }
        }
        models: {}
        inputs: {}
        queries: {}
        mutations: {}
        subscriptions: {}
        context: {}
      }>()

      // make sure action returns us a proper RequestAction object
      expect(app.action("GET /users")).toEqual({
        "@type": "RequestAction",
        _action: undefined,
        name: "GET /users",
        method: "GET",
        path: "/users",
        options: {},
      } as AnyRequestAction)

      // make sure params are handled in action properly
      expect(
        app.action("GET /users/:id", {
          params: {
            id: 1,
          },
        }),
      ).toEqual({
        "@type": "RequestAction",
        _action: undefined,
        name: "GET /users/:id",
        method: "GET",
        path: "/users/:id",
        options: {
          params: {
            id: 1,
          },
        },
      } as AnyRequestAction)

      // here we expect a compilation error since such action isn't registered in the app
      // @ts-expect-error
      app.action("/photos")
    })
  })
})
