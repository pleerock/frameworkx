import { parse } from "@microframework/parser"

describe("parse inputs > type app", () => {
  test("input defined as a type", () => {
    const result = parse(__dirname + "/type-app.ts")
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
          propertyPath: "PostType",
          typeName: "PostType",
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
              propertyPath: "PostInputType.id",
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
              propertyPath: "PostInputType.name",
            },
          ],
          typeName: "PostInputType",
          propertyName: "PostInputType",
          propertyPath: "PostInputType",
          description: "This way we are testing type support.",
        },
      ],
      queries: [],
      mutations: [],
      subscriptions: [],
    })
  })
})
