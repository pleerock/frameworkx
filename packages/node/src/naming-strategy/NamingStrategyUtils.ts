/**
 * Utility helper functions for naming strategies.
 */
export const NamingStrategyUtils = {
  /**
   * Capitalizes first letter of the given string.
   */
  capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  },
  /**
   * Of the given string makes first letter small.
   */
  smallize(str: string) {
    return str.charAt(0).toLowerCase() + str.slice(1)
  },
  /**
   * Transforms given string into camelCase.
   */
  camelize(str: string) {
    return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
      if (+match === 0) return "" // or if (/\s+/.test(match)) for white spaces
      return index === 0 ? match.toLowerCase() : match.toUpperCase()
    })
  },
}
