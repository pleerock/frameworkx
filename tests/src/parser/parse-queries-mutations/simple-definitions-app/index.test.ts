import { parse } from "@microframework/parser"

describe("parse queries", () => {
  test("simple definitions", () => {
    const result = parse(__dirname + "/simple-definitions-app.ts")
    // console.log(JSON.stringify(result, undefined, 2))
    expect(result).toEqual({
      "@type": "ApplicationTypeMetadata",
      actions: [],
      description: "",
      inputs: [
        {
          "@type": "TypeMetadata",
          args: [],
          array: false,
          canBeUndefined: false,
          deprecated: false,
          description: "Simple input for testing purposes.",
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
              propertyPath: "PostInput.id",
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
              propertyName: "name",
              propertyPath: "PostInput.name",
            },
          ],
          propertyName: "PostInput",
          propertyPath: "PostInput",
          typeName: "PostInput",
        },
        {
          "@type": "TypeMetadata",
          args: [],
          array: false,
          canBeUndefined: false,
          deprecated: false,
          description: "Simple input for testing purposes.",
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
              propertyPath: "PostFilterInput.id",
            },
            {
              "@type": "TypeMetadata",
              args: [],
              array: false,
              canBeUndefined: true,
              deprecated: false,
              description: "",
              kind: "string",
              nullable: false,
              properties: [],
              propertyName: "name",
              propertyPath: "PostFilterInput.name",
            },
          ],
          propertyName: "PostFilterInput",
          propertyPath: "PostFilterInput",
          typeName: "PostFilterInput",
        },
        {
          "@type": "TypeMetadata",
          args: [],
          array: false,
          canBeUndefined: false,
          deprecated: false,
          description: "Simple input for testing purposes.",
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
              propertyPath: "CategoryInput.id",
            },
            {
              "@type": "TypeMetadata",
              args: [],
              array: false,
              canBeUndefined: false,
              deprecated: false,
              description: "",
              kind: "string",
              nullable: true,
              properties: [],
              propertyName: "name",
              propertyPath: "CategoryInput.name",
            },
          ],
          propertyName: "CategoryInput",
          propertyPath: "CategoryInput",
          typeName: "CategoryInput",
        },
      ],
      models: [
        {
          "@type": "TypeMetadata",
          args: [],
          array: false,
          canBeUndefined: false,
          deprecated: false,
          description: "Type for a PostModel.",
          kind: "object",
          modelName: "PostModel",
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
              propertyPath: "PostType.id",
            },
            {
              "@type": "TypeMetadata",
              args: [
                {
                  "@type": "TypeMetadata",
                  args: [],
                  array: false,
                  canBeUndefined: false,
                  deprecated: false,
                  description: "",
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
                      kind: "string",
                      nullable: false,
                      properties: [],
                      propertyName: "keyword",
                      propertyPath: "PostType.Args.name.keyword",
                    },
                  ],
                  propertyPath: "PostType.Args.name",
                },
              ],
              array: false,
              canBeUndefined: false,
              deprecated: false,
              description: "",
              kind: "string",
              nullable: false,
              properties: [],
              propertyName: "name",
              propertyPath: "PostType.name",
            },
          ],
          propertyName: "PostType",
          propertyPath: "PostType",
          typeName: "PostType",
        },
        {
          "@type": "TypeMetadata",
          args: [],
          array: false,
          canBeUndefined: false,
          deprecated: false,
          description: "Dummy type.",
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
              propertyPath: "CategoryType.id",
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
              propertyName: "name",
              propertyPath: "CategoryType.name",
            },
          ],
          propertyName: "CategoryType",
          propertyPath: "CategoryType",
          typeName: "CategoryType",
        },
      ],
      mutations: [
        {
          "@type": "TypeMetadata",
          args: [
            {
              "@type": "TypeMetadata",
              args: [],
              array: false,
              canBeUndefined: false,
              deprecated: false,
              description: "",
              kind: "reference",
              nullable: false,
              properties: [],
              propertyPath: "postSave.Args",
              typeName: "PostInput",
            },
          ],
          array: false,
          canBeUndefined: false,
          deprecated: false,
          description: "",
          kind: "function",
          nullable: false,
          properties: [],
          propertyName: "postSave",
          propertyPath: "postSave",
          returnType: {
            "@type": "TypeMetadata",
            args: [],
            array: false,
            canBeUndefined: false,
            deprecated: false,
            description: "",
            kind: "reference",
            nullable: false,
            properties: [],
            propertyPath: "postSave.Return",
            typeName: "PostType",
          },
        },
        {
          "@type": "TypeMetadata",
          args: [
            {
              "@type": "TypeMetadata",
              args: [],
              array: false,
              canBeUndefined: false,
              deprecated: false,
              description: "",
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
                  propertyPath: "postRemove.Args.id",
                },
              ],
              propertyPath: "postRemove.Args",
            },
          ],
          array: false,
          canBeUndefined: false,
          deprecated: false,
          description: "",
          kind: "function",
          nullable: false,
          properties: [],
          propertyName: "postRemove",
          propertyPath: "postRemove",
          returnType: {
            "@type": "TypeMetadata",
            args: [],
            array: false,
            canBeUndefined: false,
            deprecated: false,
            description: "",
            kind: "boolean",
            nullable: false,
            properties: [],
            propertyPath: "postRemove.Return",
          },
        },
        {
          "@type": "TypeMetadata",
          args: [
            {
              "@type": "TypeMetadata",
              args: [],
              array: true,
              canBeUndefined: false,
              deprecated: false,
              description: "",
              kind: "reference",
              nullable: false,
              properties: [],
              propertyPath: "categoriesSave.Args",
              typeName: "CategoryInput",
            },
          ],
          array: false,
          canBeUndefined: false,
          deprecated: false,
          description: "",
          kind: "function",
          nullable: false,
          properties: [],
          propertyName: "categoriesSave",
          propertyPath: "categoriesSave",
          returnType: {
            "@type": "TypeMetadata",
            args: [],
            array: true,
            canBeUndefined: false,
            deprecated: false,
            description: "",
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
                propertyPath: "categoriesSave.Return.id",
              },
            ],
            propertyPath: "categoriesSave.Return",
          },
        },
      ],
      name: "App",
      queries: [
        {
          "@type": "TypeMetadata",
          args: [
            {
              "@type": "TypeMetadata",
              args: [],
              array: false,
              canBeUndefined: false,
              deprecated: false,
              description: "",
              kind: "reference",
              nullable: false,
              properties: [],
              propertyPath: "posts.Args",
              typeName: "PostFilterInput",
            },
          ],
          array: false,
          canBeUndefined: false,
          deprecated: false,
          description: "",
          kind: "function",
          nullable: false,
          properties: [],
          propertyName: "posts",
          propertyPath: "posts",
          returnType: {
            "@type": "TypeMetadata",
            args: [],
            array: true,
            canBeUndefined: false,
            deprecated: false,
            description: "",
            kind: "reference",
            nullable: false,
            properties: [],
            propertyPath: "posts.Return",
            typeName: "PostType",
          },
        },
        {
          "@type": "TypeMetadata",
          args: [
            {
              "@type": "TypeMetadata",
              args: [],
              array: false,
              canBeUndefined: false,
              deprecated: false,
              description: "",
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
                  propertyPath: "post.Args.id",
                },
              ],
              propertyPath: "post.Args",
            },
          ],
          array: false,
          canBeUndefined: false,
          deprecated: false,
          description: "",
          kind: "function",
          nullable: false,
          properties: [],
          propertyName: "post",
          propertyPath: "post",
          returnType: {
            "@type": "TypeMetadata",
            args: [],
            array: false,
            canBeUndefined: false,
            deprecated: false,
            description: "",
            kind: "reference",
            nullable: false,
            properties: [],
            propertyPath: "post.Return",
            typeName: "PostType",
          },
        },
        {
          "@type": "TypeMetadata",
          args: [],
          array: false,
          canBeUndefined: false,
          deprecated: false,
          description: "",
          kind: "function",
          nullable: false,
          properties: [],
          propertyName: "category",
          propertyPath: "category",
          returnType: {
            "@type": "TypeMetadata",
            args: [],
            array: false,
            canBeUndefined: false,
            deprecated: false,
            description: "",
            kind: "reference",
            nullable: false,
            properties: [],
            propertyPath: "category.Return",
            typeName: "CategoryType",
          },
        },
        {
          "@type": "TypeMetadata",
          args: [],
          array: false,
          canBeUndefined: false,
          deprecated: false,
          description: "",
          kind: "function",
          nullable: false,
          properties: [],
          propertyName: "categories",
          propertyPath: "categories",
          returnType: {
            "@type": "TypeMetadata",
            args: [],
            array: true,
            canBeUndefined: false,
            deprecated: false,
            description: "",
            kind: "reference",
            nullable: false,
            properties: [],
            propertyPath: "categories.Return",
            typeName: "CategoryType",
          },
        },
        {
          "@type": "TypeMetadata",
          args: [],
          array: false,
          canBeUndefined: false,
          deprecated: false,
          description: "",
          kind: "function",
          nullable: false,
          properties: [],
          propertyName: "categoryCount",
          propertyPath: "categoryCount",
          returnType: {
            "@type": "TypeMetadata",
            args: [],
            array: false,
            canBeUndefined: false,
            deprecated: false,
            description: "",
            kind: "number",
            nullable: false,
            properties: [],
            propertyPath: "categoryCount.Return",
          },
        },
      ],
      subscriptions: [],
    })
  })
})
