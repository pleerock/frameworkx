import { parse } from "@microframework/parser"

describe("parse models > model no args app", () => {
  test("model defined as a Model without args", () => {
    const result = parse(__dirname + "/model-no-args-app.ts")
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
          modelName: "PostModelNoArgs",
          description: "Type for a PostModel.",
        },
      ],
      inputs: [],
      queries: [],
      mutations: [],
      subscriptions: [],
    })
  })
})
