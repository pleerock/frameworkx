import { parse } from "@microframework/parser"

describe("parse models > complex type app", () => {
  test("model with complex type", () => {
    const result = parse(__dirname + "/complex-type-app.ts")
    // console.log(JSON.stringify(result, undefined, 2))

    expect(result).toEqual({
      "@type": "ApplicationTypeMetadata",
      name: "App",
      description: "",
      actions: [],
      models: [
        {
          "@type": "TypeMetadata",
          args: [],
          array: false,
          canBeUndefined: false,
          deprecated: false,
          description: "This way we are testing interface support.",
          kind: "object",
          nullable: false,
          properties: [
            {
              "@type": "TypeMetadata",
              args: [],
              array: false,
              canBeUndefined: false,
              deprecated: false,
              description: "",
              kind: "number",
              nullable: false,
              properties: [],
              propertyName: "id",
              propertyPath: "PhotoInterface.id",
            },
            {
              "@type": "TypeMetadata",
              args: [],
              array: false,
              canBeUndefined: false,
              deprecated: false,
              description: "",
              kind: "string",
              nullable: false,
              properties: [],
              propertyName: "filename",
              propertyPath: "PhotoInterface.filename",
            },
          ],
          propertyName: "PhotoInterface",
          propertyPath: "PhotoInterface",
          typeName: "PhotoInterface",
        },
        {
          "@type": "TypeMetadata",
          kind: "object",
          array: false,
          nullable: false,
          canBeUndefined: false,
          deprecated: false,
          args: [],
          properties: [
            {
              "@type": "TypeMetadata",
              kind: "number",
              array: false,
              nullable: false,
              canBeUndefined: false,
              deprecated: false,
              description: "",
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
          modelName: "PostModel",
          propertyName: "PostType",
          propertyPath: "PostType",
          typeName: "PostType",
          description: "Type for a PostModel.",
        },
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
              propertyPath: "PersonComplexType.id",
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
              propertyName: "firstName",
              propertyPath: "PersonComplexType.firstName",
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
              propertyName: "lastName",
              propertyPath: "PersonComplexType.lastName",
            },
            {
              "@type": "TypeMetadata",
              kind: "string",
              array: true,
              nullable: false,
              deprecated: false,
              description: "",
              canBeUndefined: false,
              args: [],
              properties: [],
              propertyName: "alternativeNames",
              propertyPath: "PersonComplexType.alternativeNames",
            },
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
              propertyName: "age",
              propertyPath: "PersonComplexType.age",
            },
            {
              "@type": "TypeMetadata",
              kind: "boolean",
              array: false,
              nullable: false,
              deprecated: false,
              description: "",
              canBeUndefined: false,
              args: [],
              properties: [],
              propertyName: "isActive",
              propertyPath: "PersonComplexType.isActive",
            },
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
                      propertyName: "name",
                      propertyPath:
                        "PersonComplexType.career.organization.name",
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
                      propertyName: "description",
                      propertyPath:
                        "PersonComplexType.career.organization.description",
                    },
                  ],
                  propertyName: "organization",
                  propertyPath: "PersonComplexType.career.organization",
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
                  propertyName: "position",
                  propertyPath: "PersonComplexType.career.position",
                },
              ],
              propertyPath: "PersonComplexType.career",
              propertyName: "career",
            },
            {
              "@type": "TypeMetadata",
              kind: "object",
              array: true,
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
                  propertyName: "name",
                  propertyPath: "PersonComplexType.educations.name",
                },
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
                  propertyName: "from",
                  propertyPath: "PersonComplexType.educations.from",
                },
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
                  propertyName: "to",
                  propertyPath: "PersonComplexType.educations.to",
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
                  propertyName: "degree",
                  propertyPath: "PersonComplexType.educations.degree",
                },
              ],
              // typeName: "",
              propertyPath: "PersonComplexType.educations",
              propertyName: "educations",
            },
            {
              "@type": "TypeMetadata",
              kind: "reference",
              array: false,
              nullable: false,
              deprecated: false,
              canBeUndefined: false,
              args: [],
              properties: [],
              typeName: "PhotoInterface",
              description: "",
              propertyName: "mainPhoto",
              propertyPath: "PersonComplexType.mainPhoto",
            },
            {
              "@type": "TypeMetadata",
              kind: "reference",
              array: true,
              nullable: false,
              deprecated: false,
              canBeUndefined: false,
              args: [],
              properties: [],
              typeName: "PhotoInterface",
              description: "",
              propertyName: "photos",
              propertyPath: "PersonComplexType.photos",
            },
            {
              "@type": "TypeMetadata",
              kind: "reference",
              array: true,
              nullable: false,
              deprecated: false,
              description: "",
              canBeUndefined: false,
              args: [],
              properties: [],
              typeName: "PostType",
              propertyName: "posts",
              propertyPath: "PersonComplexType.posts",
            },
            {
              "@type": "TypeMetadata",
              kind: "object",
              array: false,
              nullable: false,
              deprecated: false,
              description: "",
              canBeUndefined: false,
              args: [],
              properties: [],
              typeName: "Float",
              propertyName: "rating",
              propertyPath: "PersonComplexType.rating",
            },
            {
              "@type": "TypeMetadata",
              kind: "enum",
              array: false,
              nullable: false,
              deprecated: false,
              canBeUndefined: false,
              args: [],
              properties: [
                {
                  "@type": "TypeMetadata",
                  kind: "object",
                  array: false,
                  nullable: false,
                  deprecated: false,
                  canBeUndefined: false,
                  args: [],
                  properties: [],
                  propertyName: "active",
                  propertyPath: "PersonComplexType.status.active",
                  description: "",
                },
                {
                  "@type": "TypeMetadata",
                  kind: "object",
                  array: false,
                  nullable: false,
                  deprecated: false,
                  canBeUndefined: false,
                  args: [],
                  properties: [],
                  propertyName: "inactive",
                  propertyPath: "PersonComplexType.status.inactive",
                  description: "",
                },
              ],
              description: "",
              propertyName: "status",
              propertyPath: "PersonComplexType.status",
            },
          ],
          typeName: "PersonComplexType",
          propertyPath: "PersonComplexType",
          propertyName: "PersonComplexType",
          description: "Complex type support test.",
        },
      ],
      inputs: [],
      queries: [],
      mutations: [],
      subscriptions: [],
    })
  })
})
