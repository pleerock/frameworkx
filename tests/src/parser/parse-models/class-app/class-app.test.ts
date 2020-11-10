import { parse } from "@microframework/parser"

describe("parse models > class app", () => {
  test("model defined as a class", () => {
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
          typeName: "UserClass",
          description: "",
        },
      ],
      inputs: [],
      queries: [],
      mutations: [],
      subscriptions: [],
    })
  })
})
