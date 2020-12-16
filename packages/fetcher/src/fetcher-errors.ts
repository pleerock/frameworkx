/**
 * Errors thrown in the Fetcher package.
 */
export const FetcherErrors = {
  /**
   * Error thrown when some Fetcher method is called without application instance set in the Fetcher.
   */
  noAppToUseOperator(type: string) {
    return new Error(
      `Application instance must be set in the Fetcher in order to use "${type}" operator.`,
    )
  },
  /**
   * Error thrown when "graphqlEndpoint" option isn't defined in the FetcherOptions.
   */
  noGraphQLEndpointDefined() {
    return new Error(
      `"graphqlEndpoint" must be defined in the Fetcher options in order to execute GraphQL queries.`,
    )
  },
  /**
   * Error thrown when "actionEndpoint" option isn't defined in the FetcherOptions.
   */
  noActionEndpointDefined() {
    return new Error(
      `"actionEndpoint" must be defined in the Fetcher options in order to execute actions.`,
    )
  },
  /**
   * Error thrown when "websocketEndpoint" option isn't defined in the FetcherOptions.
   */
  noWebsocketEndpointDefined() {
    return new Error(
      `"websocketEndpoint" must be defined in the Fetcher options in order to establish a WebSocket connection.`,
    )
  },
  /**
   * Error thrown when FetcherOption's websocketFactory was incorrectly defined.
   */
  websocketFactoryInvalid() {
    return new Error(
      `"websocketFactory" passed in the options to Fetcher returned invalid WebSocket instance.`,
    )
  },
  /**
   * Error thrown when WebSocket connection is already established.
   */
  wsAlreadyConnected() {
    return new Error(`WebSocket connection is already established.`)
  },
  /**
   * Error thrown when WebSocket connection is not established.
   */
  wsNotConnected() {
    return new Error(
      `WebSocket connection isn't established. Use ".connect" method on Fetcher to establish a new connection.`,
    )
  },
  /**
   * Error thrown when user tries to use variables in actions.
   * This is unsupported operation.
   */
  variablesNotSupportedInAction() {
    return new Error(
      `Variables aren't supported in action requests. Only GraphQL queries must use them.`,
    )
  },
  /**
   * Error thrown when user tries to select data without calling "add" method.
   */
  requestItemNotAddedInQb() {
    return new Error(
      `You must add a requested root declaration before selecting properties.`,
    )
  },
  /**
   * Error thrown when user tries to build a GraphQL query with mixed types,
   * like queries + mutations, etc.
   */
  mixedDeclarationTypesInQuery() {
    return new Error(
      `A single request can't mix queries, mutations and subscriptions.`,
    )
  },
}
