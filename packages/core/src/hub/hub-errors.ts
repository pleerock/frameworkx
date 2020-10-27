/**
 * Errors thrown in the Hub.
 */
export const HubErrors = {
  /**
   * Thrown when app missing in the Hub is requested.
   */
  unknownApp(appName: string) {
    return new Error(`"${appName}" isn't registered in the Hub.`)
  },
}
