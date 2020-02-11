import { ActionTypeMetadata, TypeMetadata } from "../type-metadata"

/**
 * Event that can be logged.
 */
export type LogEvent = {
    request: any
    response: any
    typeMetadata?: TypeMetadata
    actionMetadata?: ActionTypeMetadata
    modelName?: string
    propertyName?: string
    graphQLResolverArgs?: {
        parent: any
        args: any
        context: any
        info: any
    }
}
