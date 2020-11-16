import { parse } from "@microframework/parser"

describe("parse models > interface app", () => {
  test("model defined as an interface", () => {
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
              propertyPath: "PhotoInterface.id",
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
              propertyName: "filename",
              propertyPath: "PhotoInterface.filename",
            },
          ],
          typeName: "PhotoInterface",
          propertyName: "PhotoInterface",
          propertyPath: "PhotoInterface",
          description: "This way we are testing interface support.",
        },
      ],
      inputs: [],
      queries: [],
      mutations: [],
      subscriptions: [],
    })
  })
})
