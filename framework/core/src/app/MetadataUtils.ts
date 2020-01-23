import {TypeMetadata} from "./types";

export const MetadataUtils = {
    isTypePrimitive(metadata: TypeMetadata) {
        return  metadata.typeName === "string" ||
                metadata.typeName === "number" ||
                metadata.typeName === "boolean"
    }
}