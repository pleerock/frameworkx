/**
 * List of TypeMetadata kinds.
 */
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

/**
 * TypeMetadata contains information about specific type and its properties.
 * Type can be a model, input, GraphQL queries, mutations, subscriptions, REST actions.
 */
export type TypeMetadata = {
  /**
   * Unique type identifier.
   */
  "@type": "TypeMetadata"

  /**
   * Type metadata kind.
   */
  kind: TypeMetadataKind

  /**
   * Indicates if type is an array.
   */
  array: boolean

  /**
   * Indicates if type can be a null.
   */
  nullable: boolean

  /**
   * Indicates if type can be an undefined.
   */
  canBeUndefined: boolean // todo: provide a descriptive description with examples

  /**
   * Model name.
   */
  modelName?: string // todo: provide a descriptive description with examples

  /**
   * Type name.
   */
  typeName?: string // todo: provide a descriptive description with examples

  /**
   * If this TypeMetadata is some other type's property,
   * propertyName will be set to that type's property name.
   */
  propertyName?: string

  /**
   * Type description.
   */
  description?: string

  /**
   * Indicates if type is deprecated.
   * If set to string, it means property is deprecated and there is a string reason for that.
   */
  deprecated?: boolean | string

  /**
   * If type is an object signature for example, it will contain it's properties.
   */
  properties: TypeMetadata[]

  /**
   * If type is a GraphQL query / mutation / subscription,
   * it's input will be set here.
   */
  args?: TypeMetadata // todo: rename to "input"
}

/**
 * ActionTypeMetadata contains information about "actions".
 * Actions are REST-like endpoints in your application.
 */
export type ActionTypeMetadata = {
  /**
   * Unique type identifier.
   */
  "@type": "ActionTypeMetadata"

  /**
   * Action name, e.g. "GET /users"
   */
  name: string

  /**
   * Action description.
   */
  description?: string

  /**
   * What data this action returns.
   */
  return?: TypeMetadata

  /**
   * What query params this action accepts.
   */
  query?: TypeMetadata

  /**
   * What route params this action accepts.
   */
  params?: TypeMetadata

  /**
   * What body this action accepts.
   */
  body?: TypeMetadata

  /**
   * What headers this action returns.
   */
  headers?: TypeMetadata

  /**
   * What cookies this action returns.
   */
  cookies?: TypeMetadata
}

/**
 * Application metadata.
 * Application is a root entry in your app.
 */
export type ApplicationTypeMetadata = {
  /**
   * Unique type identifier.
   */
  "@type": "ApplicationTypeMetadata"

  /**
   * Application name.
   */
  name: string

  /**
   * Application description.
   */
  description: string | undefined

  /**
   * Actions defined in the app.
   */
  actions: ActionTypeMetadata[]

  /**
   * Models defined in the app.
   */
  models: TypeMetadata[]

  /**
   * Inputs defined in the app.
   */
  inputs: TypeMetadata[]

  /**
   * GraphQL queries defined in the app.
   */
  queries: TypeMetadata[]

  /**
   * GraphQL mutations defined in the app.
   */
  mutations: TypeMetadata[]

  /**
   * GraphQL subscriptions defined in the app.
   */
  subscriptions: TypeMetadata[]
}
