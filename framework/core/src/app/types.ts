
export type TypeMetadata = {
    modelName?: string
    typeName: string // includes "number" | "string" | "boolean"
    propertyName?: string
    value?: any
    description?: string
    array: boolean
    nullable: boolean
    enum: boolean
    union: boolean
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
    selections: SelectionMetadata[]
}
