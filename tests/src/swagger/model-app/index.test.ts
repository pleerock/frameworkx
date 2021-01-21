import { parse } from "@microframework/parser"
import { generateSwaggerDocumentation } from "@microframework/node/_/swagger-generator"
import { OpenAPIV3 } from "openapi-types"
import SchemaObject = OpenAPIV3.SchemaObject

describe("swagger > generate documentation", () => {
  test("actions defined with a referenced types", () => {
    const appMetadata = parse(__dirname + "/model-app.ts")
    const swaggerOutput = generateSwaggerDocumentation(appMetadata)
    // console.log(JSON.stringify(swaggerOutput, undefined, 2))

    expect(swaggerOutput.components).toBeDefined()
    expect(swaggerOutput.components!.schemas).toBeDefined()

    const categorySchema = swaggerOutput.components!.schemas!
      .Category as SchemaObject

    // @ts-expect-error
    categorySchema.$ref

    expect(categorySchema.type).toEqual("object")
    expect(categorySchema.properties!.id).toEqual({ type: "integer" })
    expect(categorySchema.properties!.name).toEqual({ type: "string" })
    expect(categorySchema.properties!.posts).toEqual({
      type: "array",
      items: {
        $ref: "#/components/schemas/Post",
      },
    })

    // ------------------------------------------------

    const postSchema = swaggerOutput.components!.schemas!.Post as SchemaObject

    // @ts-expect-error
    postSchema.$ref

    expect(postSchema.type).toEqual("object")
    expect(postSchema.properties!.id).toEqual({ type: "integer" })
    expect(postSchema.properties!.title).toEqual({ type: "string" })
    expect(postSchema.properties!.categoryCount).toEqual({
      type: "integer",
    })
    expect(postSchema.properties!.categories).toEqual({
      type: "array",
      items: {
        $ref: "#/components/schemas/Category",
      },
    })
    expect(postSchema.properties!.status).toEqual({
      type: "string",
      enum: ["moderated", "under_moderation"],
    })

    // ------------------------------------------------

    const path0 = swaggerOutput.paths["/api/category/:id"]
    expect(path0!.get).toEqual({
      summary: "Loads a single category by its id.",
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          description: "Category id.",
        },
        {
          description: "",
          in: "header",
          name: "X-Request-ID",
          required: true,
        },
        {
          description: "",
          in: "cookie",
          name: "accessToken",
          required: true,
        },
      ],
      deprecated: false,
      responses: {
        "200": {
          description: "",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Category",
              },
            },
          },
        },
      },
    })
    expect(path0!.delete).toEqual({
      summary: "Removes a category.",
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          description: "Category id.",
        },
      ],
      deprecated: false,
      responses: {
        "200": {
          description: "",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: {
                    type: "boolean",
                  },
                },
                required: ["success"],
              },
            },
          },
        },
      },
    })

    // ------------------------------------------------

    const path1 = swaggerOutput.paths["/api/category"]
    expect(path1!.post).toEqual({
      summary: "Saves a category.",
      parameters: [],
      deprecated: false,
      responses: {
        "200": {
          description: "",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Category",
              },
            },
          },
        },
      },
      requestBody: {
        description:
          "This input is used to create new category or change exist one.",
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/CategoryInput",
            },
          },
        },
      },
    })

    // ------------------------------------------------

    const path2 = swaggerOutput.paths["/api/categories"]
    expect(path2!.delete!.deprecated).toBeTruthy()

    // ------------------------------------------------

    const path3 = swaggerOutput.paths["/api/post"]
    expect(path3!.post).toEqual({
      summary: "Saves a post.",
      parameters: [],
      deprecated: false,
      responses: {
        "200": {
          description: "",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  id: {
                    type: "string",
                  },
                  title: {
                    type: "string",
                  },
                  status: {
                    type: "string",
                    enum: ["moderated", "under_moderation"],
                  },
                  categories: {
                    type: "array",
                    items: {
                      $ref: "#/components/schemas/Category",
                    },
                  },
                },
                required: ["id", "title", "status", "categories"],
              },
            },
          },
        },
      },
      requestBody: {
        description: "",
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                id: {
                  type: "string",
                },
                title: {
                  type: "string",
                },
              },
              required: ["id", "title"],
            },
          },
        },
      },
    })
  })
})
