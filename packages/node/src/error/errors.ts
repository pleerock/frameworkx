/**
 * Errors thrown in the app.
 */
export const Errors = {
  pubSubNotDefined() {
    return new Error(
      `You must defined a "pubSub" property of a websocket configuration in order to use subscriptions.`,
    )
  },
}
