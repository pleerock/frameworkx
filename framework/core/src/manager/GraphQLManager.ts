import {AnyApplicationOptions, ApplicationMetadata, ApplicationProperties} from "../app";

export type GraphQLVariables = {
  [key: string]: any
}

/**
 */
export class GraphQLManager<
  AppOptions extends AnyApplicationOptions,
  > {

  /**
   * Application's properties.
   */
  readonly appProperties: ApplicationProperties

  /**
   * Application's metadata.
   */
  readonly appMetadata: ApplicationMetadata

  constructor(
    appProperties: ApplicationProperties,
    appMetadata: ApplicationMetadata,
  ) {
    this.appProperties = appProperties
    this.appMetadata = appMetadata
  }

  /**
   */
  fetch<T = any>(query: string | { loc?: { source: { body: string }}}, variables?: GraphQLVariables): Promise<{ data: T }> {
    if (!this.appProperties.client)
      throw new Error("Client is not set!")

    return this.appProperties.client.graphqlFetch(query, variables)
  }

}
