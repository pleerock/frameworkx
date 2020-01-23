import {TypeMetadata, TypeMetadataKind} from "./types";

export const MetadataUtils = {

    createType(kind: TypeMetadataKind, type?: Partial<TypeMetadata>): TypeMetadata {
        return {
            kind,
            array: false,
            nullable: false,
            properties: [],
            ...(type || {})
        }
    },

    isTypePrimitive(metadata: TypeMetadata) {
        return  metadata.kind === "string" ||
                metadata.kind === "number" ||
                metadata.kind === "boolean"
    }
}