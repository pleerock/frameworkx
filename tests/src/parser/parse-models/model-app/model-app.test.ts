import { parse } from "@microframework/parser"

describe("parse models > model app", () => {
  test("model defined as a Model with args", () => {
    const result = parse(__dirname + "/model-app.ts")
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
              propertyPath: "PostType.id",
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
              propertyPath: "PostType.name",
              args: [
                {
                  "@type": "TypeMetadata",
                  kind: "object",
                  array: false,
                  nullable: false,
                  deprecated: false,
                  description: "",
                  canBeUndefined: false,
                  args: [],
                  properties: [
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
                      propertyName: "keyword",
                      propertyPath: "PostType.Args.name.keyword",
                    },
                  ],
                  propertyPath: "PostType.Args.name",
                },
              ],
            },
          ],
          typeName: "PostType",
          modelName: "PostModel",
          propertyName: "PostType",
          propertyPath: "PostType",
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
