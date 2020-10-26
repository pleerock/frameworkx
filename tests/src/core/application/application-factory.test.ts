import { createApp } from "@microframework/core"

describe("core > application > factory", () => {
  describe("createApp", () => {
    test("initializing application instance", () => {
      const app = createApp()
      expect(app["@type"]).toBe("Application")
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
      }>()
      // this is undefined because type is "virtual", used for compilation purposes
      expect(app.model("User").type).toBe(undefined)

      // this should be equal to the model name defined in the "key" of ModelList
      expect(app.model("User").name).toBe("User")
    })
    test("application input should work as expected", () => {
      const app = createApp<{
        inputs: {
          UserInput: {
            id: number
            firstName: string
            age: number
          }
        }
      }>()
      // this is undefined because type is "virtual", used for compilation purposes
      expect(app.input("UserInput").type).toBe(undefined)

      // this should be equal to the input name defined in the "key" of InputList
      expect(app.input("UserInput").name).toBe("UserInput")
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
        }
      }>()
      expect(app.action("GET /users")).toEqual({
        model: undefined,
        name: "GET /users",
        options: {},
        selection: undefined,
        type: "action",
      })
      expect(
        app.action("GET /users/:id", {
          params: {
            id: 1,
          },
        }),
      ).toEqual({
        model: undefined,
        name: "GET /users/:id",
        options: {
          params: {
            id: 1,
          },
        },
        selection: undefined,
        type: "action",
      })
      // expect(app.action("GET /users", {}).name).toBe("GET /users")
      // expect(app.action("GET /users", {}).selection).toBe(undefined)
      // expect(app.action("GET /users", {}).options).toEqual({})
    })
  })
})
