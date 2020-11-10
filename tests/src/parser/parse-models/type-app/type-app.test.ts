import { parse } from "@microframework/parser"

describe("parse models > type app", () => {
  test("model defined as a type", () => {
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
            {
              "@type": "TypeMetadata",
              kind: "number",
              array: true,
              nullable: false,
              deprecated: false,
              description: "",
              canBeUndefined: false,
              properties: [],
              propertyName: "stars",
            },
            {
              "@type": "TypeMetadata",
              kind: "object",
              array: false,
              nullable: false,
              deprecated: false,
              canBeUndefined: false,
              properties: [],
              typeName: "AlbumStatusType",
              description: "This way we are testing type support.",
              propertyName: "status",
            },
          ],
          typeName: "AlbumType",
          description: "This way we are testing type support.",
        },
      ],
      inputs: [],
      queries: [],
      mutations: [],
      subscriptions: [],
    })
  })
})
