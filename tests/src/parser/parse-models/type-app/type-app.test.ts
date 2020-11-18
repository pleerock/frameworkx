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
              propertyPath: "AlbumType.id",
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
              propertyPath: "AlbumType.name",
            },
            {
              "@type": "TypeMetadata",
              kind: "number",
              array: true,
              nullable: false,
              deprecated: false,
              description: "",
              canBeUndefined: false,
              args: [],
              properties: [],
              propertyName: "stars",
              propertyPath: "AlbumType.stars",
            },
            {
              "@type": "TypeMetadata",
              array: false,
              canBeUndefined: false,
              deprecated: false,
              description: "This way we are testing type support.",
              kind: "enum",
              nullable: false,
              args: [],
              properties: [
                {
                  "@type": "TypeMetadata",
                  args: [],
                  array: false,
                  canBeUndefined: false,
                  deprecated: false,
                  description: "",
                  kind: "property",
                  nullable: false,
                  properties: [],
                  propertyName: "active",
                  propertyPath: "AlbumType.status.active",
                },
                {
                  "@type": "TypeMetadata",
                  args: [],
                  array: false,
                  canBeUndefined: false,
                  deprecated: false,
                  description: "",
                  kind: "property",
                  nullable: false,
                  properties: [],
                  propertyName: "inactive",
                  propertyPath: "AlbumType.status.inactive",
                },
              ],
              propertyName: "status",
              propertyPath: "AlbumType.status",
            },
          ],
          typeName: "AlbumType",
          propertyName: "AlbumType",
          propertyPath: "AlbumType",
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
