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
              propertyPath: "PostNoArgsType.id",
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
              propertyPath: "PostNoArgsType.name",
            },
          ],
          typeName: "PostNoArgsType",
          modelName: "PostModelNoArgs",
          propertyName: "PostNoArgsType",
          propertyPath: "PostNoArgsType",
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
