import { parse } from "@microframework/parser"

describe("parse inputs > class app", () => {
  test("input defined as a class", () => {
    const result = parse(__dirname + "/class-app.ts")
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
          properties: [
            {
              "@type": "TypeMetadata",
              kind: "number",
              array: false,
              nullable: false,
              deprecated: false,
              description: "",
              canBeUndefined: false,
              properties: [],
              propertyName: "id",
            },
            {
              "@type": "TypeMetadata",
              kind: "string",
              array: false,
              nullable: false,
              deprecated: false,
              description: "",
              canBeUndefined: false,
              properties: [],
              propertyName: "name",
            },
          ],
          modelName: "PostModel",
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
          properties: [
            {
              "@type": "TypeMetadata",
              kind: "number",
              array: false,
              nullable: false,
              deprecated: false,
              description: "",
              canBeUndefined: false,
              properties: [],
              propertyName: "id",
            },
            {
              "@type": "TypeMetadata",
              kind: "string",
              array: false,
              nullable: false,
              deprecated: false,
              description: "",
              canBeUndefined: false,
              properties: [],
              propertyName: "name",
            },
          ],
          typeName: "PostInputClass",
          description: "This way we are testing class support.",
        },
      ],
      queries: [],
      mutations: [],
      subscriptions: [],
    })
  })
})
