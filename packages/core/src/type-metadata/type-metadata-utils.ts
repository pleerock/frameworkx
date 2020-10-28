import { TypeMetadata, TypeMetadataKind } from "./type-metadata-types"

/**
 * Set of utility functions to work with type metadatas.
 */
export const TypeMetadataUtils = {
  /**
   * Helper function to create a type metadata.
   */
  create(
    kind: TypeMetadataKind,
    type?: Partial<Omit<TypeMetadata, "kind" | "@type">>,
  ): TypeMetadata {
    return {
      "@type": "TypeMetadata",
      kind,
      array: false,
      nullable: false,
      canBeUndefined: false,
      properties: [],
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
}
