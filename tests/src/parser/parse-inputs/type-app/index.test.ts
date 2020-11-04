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
          canBeUndefined: false,
          properties: [
            {
              "@type": "TypeMetadata",
              kind: "number",
              array: false,
              nullable: false,
              canBeUndefined: false,
              properties: [],
              propertyName: "id",
            },
            {
              "@type": "TypeMetadata",
              kind: "string",
              array: false,
              nullable: false,
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
          canBeUndefined: false,
          properties: [
            {
              "@type": "TypeMetadata",
              kind: "number",
              array: false,
              nullable: false,
              canBeUndefined: false,
              properties: [],
              propertyName: "id",
            },
            {
              "@type": "TypeMetadata",
              kind: "string",
              array: false,
              nullable: false,
              canBeUndefined: false,
              properties: [],
              propertyName: "name",
            },
          ],
          typeName: "PostInputType",
          description: "This way we are testing type support.",
        },
      ],
      queries: [],
      mutations: [],
      subscriptions: [],
    })
  })
})
