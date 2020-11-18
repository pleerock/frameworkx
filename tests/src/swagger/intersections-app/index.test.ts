import { parse } from "@microframework/parser"
import { generateSwaggerDocumentation } from "@microframework/node/_/swagger-generator"

describe("swagger > generate documentation", () => {
  test("actions defined with an intersections", () => {
    const appMetadata = parse(__dirname + "/intersections-app.ts")
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
                description: "Category id.",
                in: "body",
                name: "id",
                required: false,
                type: "number",
              },
              {
                description: "Category name.",
                in: "body",
                name: "name",
                required: false,
                type: "string",
              },
              {
                description: "Indicates if category is active.",
                in: "body",
                name: "active",
                required: false,
                type: "boolean",
              },
            ],
            responses: {
              "200": {
                description: "",
                schema: {
                  properties: {
                    id: {
                      type: "integer",
                    },
                    name: {
                      type: "string",
                    },
                    posts: {
                      items: {
                        properties: {
                          categoryCount: {
                            type: "integer",
                          },
                          id: {
                            type: "integer",
                          },
                          status: {
                            type: "object",
                          },
                          title: {
                            type: "string",
                          },
                          watched: {
                            type: "boolean",
                          },
                          watchesCount: {
                            type: "integer",
                          },
                        },
                        required: [
                          "id",
                          "title",
                          "categoryCount",
                          "status",
                          "watched",
                          "watchesCount",
                        ],
                        type: "object",
                      },
                      type: "array",
                    },
                  },
                  required: ["id"],
                  type: "object",
                },
              },
            },
            summary: "Saves a category.",
          },
        },
        "/api/category-post/:id": {
          get: {
            parameters: [
              {
                description: "Category id.",
                in: "path",
                name: "args",
                required: true,
                type: "object",
              },
            ],
            responses: {
              "200": {
                description: "",
                schema: {
                  properties: {
                    category: {
                      properties: {
                        id: {
                          type: "integer",
                        },
                        name: {
                          type: "string",
                        },
                        posts: {
                          items: {
                            properties: {
                              categoryCount: {
                                type: "integer",
                              },
                              id: {
                                type: "integer",
                              },
                              status: {
                                type: "object",
                              },
                              title: {
                                type: "string",
                              },
                              watched: {
                                type: "boolean",
                              },
                              watchesCount: {
                                type: "integer",
                              },
                            },
                            required: [
                              "id",
                              "title",
                              "categoryCount",
                              "status",
                              "watched",
                              "watchesCount",
                            ],
                            type: "object",
                          },
                          type: "array",
                        },
                      },
                      required: ["id"],
                      type: "object",
                    },
                    post: {
                      properties: {
                        categoryCount: {
                          type: "integer",
                        },
                        id: {
                          type: "integer",
                        },
                        status: {
                          type: "object",
                        },
                        title: {
                          type: "string",
                        },
                        watched: {
                          type: "boolean",
                        },
                        watchesCount: {
                          type: "integer",
                        },
                      },
                      required: [
                        "id",
                        "title",
                        "categoryCount",
                        "status",
                        "watched",
                        "watchesCount",
                      ],
                      type: "object",
                    },
                  },
                  required: ["category", "post"],
                  type: "object",
                },
              },
            },
            summary: "Loads a single category and a single post by their ids.",
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
                    success: {
                      type: "boolean",
                    },
                  },
                  required: ["success"],
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
                  properties: {
                    id: {
                      type: "integer",
                    },
                    name: {
                      type: "string",
                    },
                    posts: {
                      items: {
                        properties: {
                          categoryCount: {
                            type: "integer",
                          },
                          id: {
                            type: "integer",
                          },
                          status: {
                            type: "object",
                          },
                          title: {
                            type: "string",
                          },
                          watched: {
                            type: "boolean",
                          },
                          watchesCount: {
                            type: "integer",
                          },
                        },
                        required: [
                          "id",
                          "title",
                          "categoryCount",
                          "status",
                          "watched",
                          "watchesCount",
                        ],
                        type: "object",
                      },
                      type: "array",
                    },
                  },
                  required: ["id"],
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
