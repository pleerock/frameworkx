export type TypeMetadataKind =
  | "number"
  | "bigint"
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
  canBeUndefined: boolean
  modelName?: string
  typeName?: string
  propertyName?: string
  description?: string
  deprecated?: boolean | string
  properties: TypeMetadata[]
  args?: TypeMetadata
}

export type ActionTypeMetadata = {
  name: string
  description: string | undefined
  return?: TypeMetadata
  query?: TypeMetadata
  params?: TypeMetadata
  headers?: TypeMetadata
  cookies?: TypeMetadata
  body?: TypeMetadata
}

export type ApplicationTypeMetadata = {
  name: string
  description: string | undefined
  actions: ActionTypeMetadata[]
  models: TypeMetadata[]
  inputs: TypeMetadata[]
  queries: TypeMetadata[]
  mutations: TypeMetadata[]
  subscriptions: TypeMetadata[]
}
