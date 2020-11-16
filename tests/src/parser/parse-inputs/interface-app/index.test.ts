import { parse } from "@microframework/parser"

describe("parse inputs > interface app", () => {
  test("input defined as an interface", () => {
    const result = parse(__dirname + "/interface-app.ts")
    // console.log(JSON.stringify(result, undefined, 2))
    expect(result).toEqual({
      "@type": "ApplicationTypeMetadata",
      name: "App",
      description: "",
      actions: [],
      models: [
        {
          "@type": "TypeMetadata",
          kind: "object",
          array: false,
          nullable: false,
          deprecated: false,
          canBeUndefined: false,
          args: [],
          properties: [
            {
              "@type": "TypeMetadata",
              kind: "number",
              array: false,
              nullable: false,
              deprecated: false,
              description: "",
              canBeUndefined: false,
              args: [],
              properties: [],
              propertyName: "id",
              propertyPath: "PostType.id",
            },
            {
              "@type": "TypeMetadata",
              kind: "string",
              array: false,
              nullable: false,
              deprecated: false,
              description: "",
              canBeUndefined: false,
              args: [],
              properties: [],
              propertyName: "name",
              propertyPath: "PostType.name",
            },
          ],
          modelName: "PostModel",
          propertyName: "PostType",
          typeName: "PostType",
          propertyPath: "PostType",
          description: "Type for a PostModel.",
        },
      ],
      inputs: [
        {
          "@type": "TypeMetadata",
          kind: "object",
          array: false,
          nullable: false,
          deprecated: false,
          canBeUndefined: false,
          args: [],
          properties: [
            {
              "@type": "TypeMetadata",
              kind: "number",
              array: false,
              nullable: false,
              deprecated: false,
              description: "",
              canBeUndefined: false,
              args: [],
              properties: [],
              propertyName: "id",
              propertyPath: "PostInputInterface.id",
            },
            {
              "@type": "TypeMetadata",
              kind: "string",
              array: false,
              nullable: false,
              deprecated: false,
              description: "",
              canBeUndefined: false,
              args: [],
              properties: [],
              propertyName: "name",
              propertyPath: "PostInputInterface.name",
            },
          ],
          typeName: "PostInputInterface",
          propertyName: "PostInputInterface",
          propertyPath: "PostInputInterface",
          description: "This way we are testing interface support.",
        },
      ],
      queries: [],
      mutations: [],
      subscriptions: [],
    })
  })
})
