import { TypeMetadata } from "@microframework/core"
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
 * Transforms given string into camelCase.
 */
function camelize(str: string) {
  return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
    if (+match === 0) return "" // or if (/\s+/.test(match)) for white spaces
    return index === 0 ? match.toLowerCase() : match.toUpperCase()
  })
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
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

  /**
   * Generates a model name for a nameless TypeMetadata.
   */
  modelTypeName(type: TypeMetadata) {
    if (type.propertyPath === type.propertyName) {
      return type.propertyPath
    }
    return capitalize(camelize(type.propertyPath.replace(/\./g, " "))) + "Model"
  },

  /**
   * Generates an input name for a nameless TypeMetadata.
   */
  inputTypeName(type: TypeMetadata) {
    if (type.propertyPath === type.propertyName) {
      return type.propertyPath
    }
    return capitalize(camelize(type.propertyPath.replace(/\./g, " "))) + "Input"
  },

  /**
   * Generates an enum name for a nameless TypeMetadata.
   */
  enumTypeName(type: TypeMetadata) {
    if (type.propertyPath === type.propertyName) {
      return type.propertyPath
    }
    return capitalize(camelize(type.propertyPath.replace(/\./g, " "))) + "Enum"
  },

  /**
   * Generates union name for a nameless TypeMetadata.
   */
  unionTypeName(type: TypeMetadata) {
    if (type.propertyPath === type.propertyName) {
      return type.propertyPath
    }
    return capitalize(camelize(type.propertyPath.replace(/\./g, " "))) + "Union"
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
