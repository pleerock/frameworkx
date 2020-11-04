import { parse } from "@microframework/parser"

describe("parse models > literal type app", () => {
  test("model with literal type", () => {
    const result = parse(__dirname + "/literal-type-app.ts")
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
            {
              "@type": "TypeMetadata",
              kind: "number",
              array: true,
              nullable: false,
              canBeUndefined: false,
              properties: [],
              propertyName: "stars",
            },
            {
              "@type": "TypeMetadata",
              kind: "object",
              array: false,
              nullable: false,
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
        {
          "@type": "TypeMetadata",
          kind: "enum",
          array: false,
          nullable: false,
          canBeUndefined: false,
          properties: [
            {
              "@type": "TypeMetadata",
              kind: "property",
              array: false,
              nullable: false,
              canBeUndefined: false,
              properties: [],
              propertyName: "active",
            },
            {
              "@type": "TypeMetadata",
              kind: "property",
              array: false,
              nullable: false,
              canBeUndefined: false,
              properties: [],
              propertyName: "inactive",
            },
          ],
          typeName: "AlbumStatusType",
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
