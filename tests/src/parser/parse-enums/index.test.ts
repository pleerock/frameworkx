import { parse } from "@microframework/parser"

describe("parser > parse enums", () => {
  test("input defined as a type", () => {
    const result = parse(__dirname + "/app/app.ts")
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
              kind: "object",
              array: false,
              nullable: false,
              deprecated: false,
              canBeUndefined: false,
              properties: [],
              typeName: "PostStatusType",
              description: "Type for a PostStatus.",
              propertyName: "status",
            },
          ],
          typeName: "PostType",
          description: "Type for a PostType.",
        },
        {
          "@type": "TypeMetadata",
          kind: "enum",
          array: false,
          nullable: false,
          deprecated: false,
          canBeUndefined: false,
          properties: [
            {
              "@type": "TypeMetadata",
              kind: "property",
              array: false,
              nullable: false,
              deprecated: false,
              description: "",
              canBeUndefined: false,
              properties: [],
              propertyName: "draft",
            },
            {
              "@type": "TypeMetadata",
              kind: "property",
              array: false,
              nullable: false,
              deprecated: false,
              description: "",
              canBeUndefined: false,
              properties: [],
              propertyName: "published",
            },
          ],
          typeName: "PostStatusType",
          description: "Type for a PostStatus.",
        },
      ],
      inputs: [],
      queries: [],
      mutations: [],
      subscriptions: [],
    })
  })
})
