import {
  ActionTypeMetadata,
  ApplicationTypeMetadata,
  TypeMetadata,
  TypeMetadataKind,
} from "./type-metadata-types"
import { DeepPartial } from "../application"

/**
 * Set of utility functions to work with type metadatas.
 */
export const TypeMetadataUtils = {
  /**
   * Helper function to create a new ApplicationTypeMetadata.
   */
  createApplicationTypeMetadata(
    name: string,
    description: string,
  ): ApplicationTypeMetadata {
    return {
      "@type": "ApplicationTypeMetadata",
      name,
      description,
      actions: [],
      models: [],
      inputs: [],
      queries: [],
      mutations: [],
      subscriptions: [],
    }
  },

  /**
   * Converts a given TypeMetadata into ActionTypeMetadata.
   */
  createActionTypeMetadata(action: TypeMetadata): ActionTypeMetadata {
    const returning = action.properties.find(
      (property) => property.propertyName === "return",
    )
    const query = action.properties.find(
      (property) => property.propertyName === "query",
    )
    const params = action.properties.find(
      (property) => property.propertyName === "params",
    )
    const headers = action.properties.find(
      (property) => property.propertyName === "headers",
    )
    const cookies = action.properties.find(
      (property) => property.propertyName === "cookies",
    )
    const body = action.properties.find(
      (property) => property.propertyName === "body",
    )

    return {
      "@type": "ActionTypeMetadata",
      name: action.propertyName!,
      description: action.description,
      deprecated: !!action.deprecated,
      return: returning ? { ...returning, propertyName: "" } : undefined,
      query,
      params,
      headers,
      cookies,
      body,
    }
  },

  /**
   * Helper function to create a new TypeMetadata.
   */
  create(
    kind: TypeMetadataKind,
    type?: Partial<Omit<TypeMetadata, "kind" | "@type">>,
  ): TypeMetadata {
    let newType: Partial<TypeMetadata> = {}
    if (type) {
      newType = { ...type }
      if (newType["@type"] !== undefined) {
        delete newType["@type"]
      }
      if (newType.kind !== undefined) {
        delete newType.kind
      }
    }
    return {
      "@type": "TypeMetadata",
      kind,
      array: false,
      nullable: false,
      canBeUndefined: false,
      deprecated: false,
      description: "",
      propertyPath: "",
      properties: [],
      args: [],
      ...(type || {}),
    }
  },

  /**
   * Checks if given type metadata is primitive.
   */
  isPrimitive(metadata: TypeMetadata): boolean {
    return (
      metadata.kind === "string" ||
      metadata.kind === "number" ||
      metadata.kind === "bigint" ||
      metadata.kind === "boolean"
    )
  },

  /**
   * Checks if given type metadata name is valid.
   */
  isNameValid(name: string): boolean {
    return name.match(/^[_a-zA-Z][_a-zA-Z0-9]*$/) !== null
  },

  /**
   * Prints metadata in a debug-friendly way.
   */
  print(metadata: ApplicationTypeMetadata) {
    function recursive(type: TypeMetadata): DeepPartial<TypeMetadata> {
      return {
        kind: type.kind,
        array: type.array,
        typeName: type.typeName,
        propertyName: type.propertyName,
        propertyPath: type.propertyPath,
        nullable: type.nullable,
        canBeUndefined: type.canBeUndefined,
        description: type.description,
        deprecated: type.deprecated,
        returnType: type.returnType ? recursive(type.returnType) : undefined,
        properties: type.properties.map((property) => recursive(property)),
        args: type.args.map((arg) => recursive(arg)),
      }
    }
    const result: DeepPartial<ApplicationTypeMetadata> = {
      actions: metadata.actions.map((action) => {
        return action
      }),
      models: metadata.models.map(recursive),
      inputs: metadata.inputs.map(recursive),
      queries: metadata.queries.map(recursive),
      mutations: metadata.mutations.map(recursive),
      subscriptions: metadata.subscriptions.map(recursive),
    }
    console.log(JSON.stringify(result, undefined, 2))
  },
}
