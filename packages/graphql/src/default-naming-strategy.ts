/**
 * Generates a random string of a given length.
 */
function randomString(length: number) {
  let result = ""
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
  const charactersLength = characters.length
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

/**
 * Default naming strategy.
 */
export const DefaultNamingStrategy = {
  namelessInput() {
    return randomString(10) + "Input"
  },

  namelessModel() {
    return randomString(10) + "Model"
  },

  defaultTypeName(type: "query" | "mutation" | "subscription"): string {
    return type === "query"
      ? "Query"
      : type === "mutation"
      ? "Mutation"
      : type === "subscription"
      ? "Subscription"
      : ""
  },

  defaultTypeDescription(type: "query" | "mutation" | "subscription"): string {
    return type === "query"
      ? "Root queries."
      : type === "mutation"
      ? "Root mutations."
      : type === "subscription"
      ? "Root subscriptions."
      : ""
  },
}
