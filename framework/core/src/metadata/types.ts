export type TypeMetadataKind =
    | "number"
    | "string"
    | "boolean"
    | "enum"
    | "union"
    | "model"
    | "object"
    | "property"

export type TypeMetadata = {
    kind: TypeMetadataKind
    array: boolean
    nullable: boolean
    modelName?: string
    typeName?: string
    propertyName?: string
    description?: string
    properties: TypeMetadata[]
    args?: TypeMetadata
}

export type DeclarationMetadata = {
    name: string
    description?: string
    returnModel: TypeMetadata
    args?: TypeMetadata
}

export type SelectionMetadata = {
    source: TypeMetadata
    selection: TypeMetadata
}

export type ActionMetadata = {
    name: string
    return: TypeMetadata
    query?: TypeMetadata
    params?: TypeMetadata
    headers?: TypeMetadata
    cookies?: TypeMetadata
    body?: TypeMetadata
}

export type ApplicationMetadata = {
    name: string
    actions: ActionMetadata[]
    models: TypeMetadata[]
    inputs: TypeMetadata[]
    queries: DeclarationMetadata[]
    mutations: DeclarationMetadata[]
    subscriptions: DeclarationMetadata[] // todo
    selections: SelectionMetadata[]
}
