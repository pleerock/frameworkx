import { parse } from "@microframework/parser"
import { generateSwaggerDocumentation } from "@microframework/node/_/swagger-generator"

describe("swagger > generate documentation", () => {
  test("actions defined with a enums", () => {
    const appMetadata = parse(__dirname + "/enums-app.ts")
    const swaggerOutput = generateSwaggerDocumentation(appMetadata)
    expect(swaggerOutput).toStrictEqual({
      consumes: ["application/json"],
      definitions: {},
      info: {
        description: "",
        title: "App",
      },
      paths: {
        "/api/category": {
          post: {
            parameters: [
              {
                description: "",
                in: "body",
                name: "new",
                required: true,
                type: "property",
              },
              {
                description: "",
                in: "body",
                name: "old",
                required: true,
                type: "property",
              },
            ],
            responses: {
              "200": {
                description: "",
                schema: {
                  type: "object",
                },
              },
            },
            summary: "Saves a category.",
          },
        },
        "/api/category/:id": {
          delete: {
            parameters: [
              {
                description: "Category id.",
                in: "path",
                name: "id",
                required: true,
                type: "number",
              },
            ],
            responses: {
              "200": {
                description: "",
                schema: {
                  properties: {
                    status: {
                      type: "object",
                    },
                  },
                  required: ["status"],
                  type: "object",
                },
              },
            },
            summary: "Removes a category.",
          },
          get: {
            parameters: [
              {
                description: "Category id.",
                in: "path",
                name: "id",
                required: true,
                type: "number",
              },
            ],
            responses: {
              "200": {
                description: "",
                schema: {
                  type: "object",
                },
              },
            },
            summary: "Loads a single category by its id.",
          },
        },
      },
      produces: ["application/json"],
      swagger: "2.0",
    })
  })
})
