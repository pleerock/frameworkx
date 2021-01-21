import { ApplicationTypeMetadata, TypeMetadata } from "@microframework/core"
import { OpenAPIV3 } from "openapi-types"
import SchemaObject = OpenAPIV3.SchemaObject
import OperationObject = OpenAPIV3.OperationObject
import PathsObject = OpenAPIV3.PathsObject
import ReferenceObject = OpenAPIV3.ReferenceObject
import Document = OpenAPIV3.Document
import NonArraySchemaObject = OpenAPIV3.NonArraySchemaObject
import NonArraySchemaObjectType = OpenAPIV3.NonArraySchemaObjectType

function typeMetadataToDefinitionProperty(
  appMetadata: ApplicationTypeMetadata,
  metadata: TypeMetadata,
  root: boolean,
): SchemaObject | ReferenceObject | NonArraySchemaObject {
  if (metadata.array) {
    return {
      type: "array",
      items: typeMetadataToDefinitionProperty(
        appMetadata,
        {
          ...metadata,
          array: false,
        },
        root,
      ),
    }
  }

  if (metadata.kind === "union") {
    return {
      oneOf: metadata.properties.map((property) => {
        return typeMetadataToDefinitionProperty(appMetadata, property, false)
      }),
    }
  }

  if (metadata.kind === "object" && metadata.typeName && !root) {
    return {
      $ref: "#/components/schemas/" + metadata.typeName, // todo: or modelName ?
    }
  }

  if (metadata.kind === "reference") {
    let referencedMetadata = appMetadata.models.find(
      (model) => model.typeName === metadata.typeName,
    )
    if (!referencedMetadata) {
      referencedMetadata = appMetadata.inputs.find(
        (model) => model.typeName === metadata.typeName,
      )
      if (!referencedMetadata) {
        throw new Error(
          `Referenced metadata ${metadata.typeName} was not found registered in the models.`,
        )
      }
    }

    return {
      $ref: "#/components/schemas/" + metadata.typeName, // todo: or modelName ?
    }
  }

  if (metadata.kind === "object") {
    return {
      type: "object",
      properties: metadata.properties.reduce(
        (properties, property: TypeMetadata) => {
          if (!property.propertyName) return properties
          return {
            ...properties,
            [property.propertyName]: typeMetadataToDefinitionProperty(
              appMetadata,
              property,
              false,
            ),
          }
        },
        {} as SchemaObject["properties"],
      ),
      required: metadata.properties
        .filter(
          (property) =>
            property.nullable === false &&
            property.canBeUndefined === false &&
            property.propertyName !== undefined,
        )
        .map((property) => property.propertyName!),
    }
  }

  if (metadata.kind === "enum") {
    return {
      type: "string",
      enum: metadata.properties.map((property) => property.propertyName),
    }
  }

  let type: NonArraySchemaObjectType | undefined = undefined
  switch (metadata.kind) {
    case "number":
      type = "integer"
      break
    case "bigint":
      type = "string"
      break
    case "string":
      type = "string"
      break
    case "boolean":
      type = "boolean"
      break
    // case "enum":
    //   type = "string"
    //   break
    // case "model":
    //   type = "object"
    //   break
    // case "object":
    //   type = "object"
    //   break
    // case "property":
    //   type = "object"
    //   break
    default:
      throw new Error(
        `"${metadata.kind}" is not supported, cannot generate a swagger documentation.`,
      )
  }
  return {
    type,
  }
}

/**
 * Generates swagger document based on application metadata.
 */
export function generateSwaggerDocumentation(
  appMetadata: ApplicationTypeMetadata,
): Document {
  const definitions: { [key: string]: SchemaObject } = [
    ...appMetadata.models,
    ...appMetadata.inputs,
  ].reduce((definitions, model) => {
    if (!model.typeName) return definitions

    return {
      ...definitions,
      [model.typeName]: typeMetadataToDefinitionProperty(
        appMetadata,
        model,
        true,
      ),
    }
  }, {})

  const paths: PathsObject[] = appMetadata.actions.reduce((paths, action) => {
    if (!action.name) return paths

    // todo: duplicate, extract into utils
    const method = action.name.substr(0, action.name.indexOf(" ")).toLowerCase() // todo: make sure to validate this before
    const route = action.name.substr(action.name.indexOf(" ") + 1)
    if (!method || !route) {
      throw new Error(
        `Invalid action defined "${action.name}". Action name must contain HTTP method (e.g. "get", "post", ...) and URL (e.g. "/users", ...).`,
      )
    }

    const operation: OperationObject = {
      summary: action.description,
      parameters: [],
      deprecated: action.deprecated,
      responses: {
        "200": {
          description: action.return ? action.return.description : "",
          content: {
            "application/json": {
              // todo: content type for other return types
              schema: action.return
                ? typeMetadataToDefinitionProperty(
                    appMetadata,
                    action.return,
                    false,
                  )
                : undefined,
            },
          },
        },
      },
    }

    if (action.params) {
      for (let parameter of action.params.properties) {
        operation.parameters!.push({
          in: "path",
          name: parameter.propertyName!, // todo: check this name
          required:
            parameter.nullable === false && parameter.canBeUndefined === false,
          // type: parameter.kind,
          description: parameter.description,
        })
      }
    }

    if (action.body) {
      operation.requestBody = {
        description: action.body.description,
        required:
          action.body.nullable === false &&
          action.body.canBeUndefined === false,
        content: {
          "application/json": {
            schema: action.body
              ? typeMetadataToDefinitionProperty(
                  appMetadata,
                  action.body,
                  false,
                )
              : undefined,
          },
        },
      }
    }
    if (action.query) {
      for (let parameter of action.query.properties) {
        operation.parameters!.push({
          in: "query",
          name: parameter.propertyName!, // todo: check this name
          required:
            parameter.nullable === false && parameter.canBeUndefined === false,
          // type: parameter.kind,
          description: parameter.description,
        })
      }
    }

    if (action.headers) {
      for (let parameter of action.headers.properties) {
        operation.parameters!.push({
          in: "header",
          name: parameter.propertyName!,
          required:
            parameter.nullable === false && parameter.canBeUndefined === false,
          // type: parameter.kind,
          description: parameter.description,
        })
      }
    }

    if (action.cookies) {
      for (let parameter of action.cookies.properties) {
        operation.parameters!.push({
          in: "cookie",
          name: parameter.propertyName!,
          required:
            parameter.nullable === false && parameter.canBeUndefined === false,
          // type: parameter.kind,
          description: parameter.description,
        })
      }
    }

    if (!(paths as any)[route]) (paths as any)[route] = {}
    ;((paths as any)[route] as any)[method] = operation

    return paths
  }, [])

  return {
    openapi: "3.0.0",
    info: {
      version: "1",
      title: appMetadata.name,
      description: appMetadata.description,
    },
    components: {
      schemas: { ...definitions },
    },
    paths: { ...paths },
  } as Document
}
