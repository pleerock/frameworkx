import { parse } from "@microframework/parser"

describe("parser > parse actions", () => {
  test("actions defined with a enums", () => {
    const appMetadata = parse(__dirname + "/enums-app.ts")
    expect(appMetadata).toStrictEqual({
      "@type": "ApplicationTypeMetadata",
      actions: [
        {
          "@type": "ActionTypeMetadata",
          body: undefined,
          cookies: undefined,
          description: "Loads a single category by its id.",
          headers: undefined,
          name: "GET /api/category/:id",
          params: {
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
                description: "Category id.",
                kind: "number",
                nullable: false,
                properties: [],
                propertyName: "id",
                propertyPath: "GET /api/category/:id.params.id",
              },
            ],
            propertyName: "params",
            propertyPath: "GET /api/category/:id.params",
          },
          query: undefined,
          return: {
            "@type": "TypeMetadata",
            args: [],
            array: false,
            canBeUndefined: false,
            deprecated: false,
            description: "Status.",
            kind: "enum",
            nullable: false,
            properties: [
              {
                "@type": "TypeMetadata",
                args: [],
                array: false,
                canBeUndefined: false,
                deprecated: false,
                description: "Indicates if operation was succeed.",
                kind: "object",
                nullable: false,
                properties: [],
                propertyName: "success",
                propertyPath: "GET /api/category/:id.return.success",
              },
              {
                "@type": "TypeMetadata",
                args: [],
                array: false,
                canBeUndefined: false,
                deprecated: false,
                description: "Indicates if operation was failed.",
                kind: "object",
                nullable: false,
                properties: [],
                propertyName: "fail",
                propertyPath: "GET /api/category/:id.return.fail",
              },
              {
                "@type": "TypeMetadata",
                args: [],
                array: false,
                canBeUndefined: false,
                deprecated: false,
                description: "Indicates if operation is pending.",
                kind: "object",
                nullable: false,
                properties: [],
                propertyName: "pending",
                propertyPath: "GET /api/category/:id.return.pending",
              },
              {
                "@type": "TypeMetadata",
                args: [],
                array: false,
                canBeUndefined: false,
                deprecated: 'Use "pending" instead',
                description: "Indicates if operation is is progress.",
                kind: "object",
                nullable: false,
                properties: [],
                propertyName: "isProgress",
                propertyPath: "GET /api/category/:id.return.isProgress",
              },
            ],
            propertyName: "",
            propertyPath: "GET /api/category/:id.return",
          },
        },
        {
          "@type": "ActionTypeMetadata",
          body: {
            "@type": "TypeMetadata",
            args: [],
            array: false,
            canBeUndefined: false,
            deprecated: false,
            description: "",
            kind: "enum",
            nullable: false,
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
                propertyName: "new",
                propertyPath: "POST /api/category.body.new",
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
                propertyName: "old",
                propertyPath: "POST /api/category.body.old",
              },
            ],
            propertyName: "body",
            propertyPath: "POST /api/category.body",
          },
          cookies: undefined,
          description: "Saves a category.",
          headers: undefined,
          name: "POST /api/category",
          params: undefined,
          query: undefined,
          return: {
            "@type": "TypeMetadata",
            args: [],
            array: false,
            canBeUndefined: false,
            deprecated: false,
            description: "Status.",
            kind: "enum",
            nullable: false,
            properties: [
              {
                "@type": "TypeMetadata",
                args: [],
                array: false,
                canBeUndefined: false,
                deprecated: false,
                description: "Indicates if operation was succeed.",
                kind: "object",
                nullable: false,
                properties: [],
                propertyName: "success",
                propertyPath: "POST /api/category.return.success",
              },
              {
                "@type": "TypeMetadata",
                args: [],
                array: false,
                canBeUndefined: false,
                deprecated: false,
                description: "Indicates if operation was failed.",
                kind: "object",
                nullable: false,
                properties: [],
                propertyName: "fail",
                propertyPath: "POST /api/category.return.fail",
              },
              {
                "@type": "TypeMetadata",
                args: [],
                array: false,
                canBeUndefined: false,
                deprecated: false,
                description: "Indicates if operation is pending.",
                kind: "object",
                nullable: false,
                properties: [],
                propertyName: "pending",
                propertyPath: "POST /api/category.return.pending",
              },
              {
                "@type": "TypeMetadata",
                args: [],
                array: false,
                canBeUndefined: false,
                deprecated: 'Use "pending" instead',
                description: "Indicates if operation is is progress.",
                kind: "object",
                nullable: false,
                properties: [],
                propertyName: "isProgress",
                propertyPath: "POST /api/category.return.isProgress",
              },
            ],
            propertyName: "",
            propertyPath: "POST /api/category.return",
          },
        },
        {
          "@type": "ActionTypeMetadata",
          body: undefined,
          cookies: undefined,
          description: "Removes a category.",
          headers: undefined,
          name: "DELETE /api/category/:id",
          params: {
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
                description: "Category id.",
                kind: "number",
                nullable: false,
                properties: [],
                propertyName: "id",
                propertyPath: "DELETE /api/category/:id.params.id",
              },
            ],
            propertyName: "params",
            propertyPath: "DELETE /api/category/:id.params",
          },
          query: undefined,
          return: {
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
                description: "Status.",
                kind: "enum",
                nullable: false,
                properties: [
                  {
                    "@type": "TypeMetadata",
                    args: [],
                    array: false,
                    canBeUndefined: false,
                    deprecated: false,
                    description: "Indicates if operation was succeed.",
                    kind: "object",
                    nullable: false,
                    properties: [],
                    propertyName: "success",
                    propertyPath:
                      "DELETE /api/category/:id.return.status.success",
                  },
                  {
                    "@type": "TypeMetadata",
                    args: [],
                    array: false,
                    canBeUndefined: false,
                    deprecated: false,
                    description: "Indicates if operation was failed.",
                    kind: "object",
                    nullable: false,
                    properties: [],
                    propertyName: "fail",
                    propertyPath: "DELETE /api/category/:id.return.status.fail",
                  },
                  {
                    "@type": "TypeMetadata",
                    args: [],
                    array: false,
                    canBeUndefined: false,
                    deprecated: false,
                    description: "Indicates if operation is pending.",
                    kind: "object",
                    nullable: false,
                    properties: [],
                    propertyName: "pending",
                    propertyPath:
                      "DELETE /api/category/:id.return.status.pending",
                  },
                  {
                    "@type": "TypeMetadata",
                    args: [],
                    array: false,
                    canBeUndefined: false,
                    deprecated: 'Use "pending" instead',
                    description: "Indicates if operation is is progress.",
                    kind: "object",
                    nullable: false,
                    properties: [],
                    propertyName: "isProgress",
                    propertyPath:
                      "DELETE /api/category/:id.return.status.isProgress",
                  },
                ],
                propertyName: "status",
                propertyPath: "DELETE /api/category/:id.return.status",
              },
            ],
            propertyName: "",
            propertyPath: "DELETE /api/category/:id.return",
          },
        },
      ],
      description: "",
      inputs: [],
      models: [],
      mutations: [],
      name: "App",
      queries: [],
      subscriptions: [],
    })
  })
})
