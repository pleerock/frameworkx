import { ApplicationTypeMetadata, TypeMetadata } from "@microframework/core"
import {
  BodyParameter,
  Operation,
  ParameterType,
  Path,
  PathParameter,
  QueryParameter,
  Schema,
  Spec,
} from "swagger-schema-official"

function typeMetadataToDefinitionProperty(
  metadata: TypeMetadata,
  root: boolean,
): Schema {
  if (metadata.array) {
    return {
      type: "array",
      items: typeMetadataToDefinitionProperty(
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
      // todo: replace to oneOf once available
      allOf: metadata.properties.map((property) => {
        return typeMetadataToDefinitionProperty(property, false)
      }),
    }
  }

  if (metadata.kind === "object" && metadata.typeName && !root) {
    return {
      $ref: "#/definitions/" + metadata.typeName, // todo: or modelName ?
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
              property,
              false,
            ),
          }
        },
        {} as Schema["properties"],
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
  let type: ParameterType | undefined = undefined
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
    case "enum":
      type = "object"
      break
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
): Spec {
  const definitions: Spec["definitions"] = [
    ...appMetadata.models,
    ...appMetadata.inputs,
  ].reduce((definitions, model) => {
    if (!model.typeName) return definitions

    return {
      ...definitions,
      [model.typeName]: typeMetadataToDefinitionProperty(model, true),
    }
  }, {} as Spec["definitions"])

  const paths: Spec["paths"] = appMetadata.actions.reduce((paths, action) => {
    if (!action.name) return paths

    // todo: duplicate, extract into utils
    const method = action.name.substr(0, action.name.indexOf(" ")).toLowerCase() // todo: make sure to validate this before
    const route = action.name.substr(action.name.indexOf(" ") + 1)
    if (!method || !route) {
      throw new Error(
        `Invalid action defined "${action.name}". Action name must contain HTTP method (e.g. "get", "post", ...) and URL (e.g. "/users", ...).`,
      )
    }

    const operation: Operation = {
      summary: action.description,
      parameters: [],
      responses: {
        "200": {
          description: "", // action.return,
          schema: action.return
            ? typeMetadataToDefinitionProperty(action.return, false)
            : undefined,
          // headers: todo
        },
      },
    }
    if (action.params) {
      for (let parameter of action.params.properties) {
        operation.parameters!.push({
          in: "path",
          name: parameter.propertyName, // todo: check this name
          required:
            parameter.nullable === false && parameter.canBeUndefined === false,
          type: parameter.kind,
          description: parameter.description,
        } as PathParameter)
      }
    }
    if (action.body) {
      for (let parameter of action.body.properties) {
        operation.parameters!.push({
          in: "body",
          name: parameter.propertyName, // todo: check this name
          required:
            parameter.nullable === false && parameter.canBeUndefined === false,
          type: parameter.kind,
          description: parameter.description,
        } as BodyParameter)
      }
    }
    if (action.query) {
      for (let parameter of action.query.properties) {
        operation.parameters!.push({
          in: "query",
          name: parameter.propertyName, // todo: check this name
          required:
            parameter.nullable === false && parameter.canBeUndefined === false,
          type: parameter.kind,
          description: parameter.description,
        } as QueryParameter)
      }
    }
    // todo: cookies, headers, etc.

    if (!paths[route]) paths[route] = {}
    ;(paths[route] as any)[method] = operation

    return paths
  }, {} as Spec["paths"])

  return {
    swagger: "2.0",
    info: {
      title: appMetadata.name,
      description: appMetadata.description,
    },
    definitions,
    paths,
    consumes: ["application/json"], // todo: implement other types
    produces: ["application/json"], // todo: implement other types
  } as Spec
}
