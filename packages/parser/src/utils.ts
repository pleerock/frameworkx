import * as ts from "typescript"

/**
 * Checks if given node is exported or not.
 */
export function isNodeExported(node: ts.Node): boolean {
  return (
    ts.ModifierFlags.Export !== 0 ||
    (!!node.parent && node.parent.kind === ts.SyntaxKind.SourceFile)
  )
}

export function camelize(str: string) {
  return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
    if (+match === 0) return "" // or if (/\s+/.test(match)) for white spaces
    return index == 0 ? match.toLowerCase() : match.toUpperCase()
  })
}

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const ParserUtils = {
  normalizeTextSymbol(symbol: string): string {
    if (symbol.substr(0, 1) === `"`) {
      symbol = symbol.substr(1)
    }
    if (symbol.substr(-1) === `"`) {
      symbol = symbol.substr(0, symbol.length - 1)
    }
    return symbol
  },

  joinStrings(...args: string[]): string {
    return args.filter((str) => str !== "").join(".")
  },

  /**
   * Checks a given string joined by a "." how many items has.
   */
  checkPathDeepness(
    str: string,
    deepness: {
      regular: number
      args: number
    },
  ): boolean {
    const argsIndex = str.indexOf(".Args.")
    if (argsIndex !== -1) {
      str = str.substr(argsIndex + ".Args.".length)
      return str.split(".").length >= deepness.args
    }

    return str.split(".").length >= deepness.regular
  },

  /**
   * Gets a deprecation status.
   */
  getDeprecation(nodeOrSymbol: ts.Node | ts.Symbol): string | boolean {
    let deprecated: string | boolean = false

    // todo: provide a type-safe way
    const symbol = (nodeOrSymbol as any)["symbol"]
      ? ((nodeOrSymbol as any)["symbol"] as ts.Symbol)
      : (nodeOrSymbol as ts.Symbol)
    if (symbol) {
      const jsDocTags = symbol.getJsDocTags()
      const deprecatedJsDocTag = jsDocTags.find(
        (tag) => tag.name === "deprecated",
      )
      if (deprecatedJsDocTag) {
        deprecated = true
        if (deprecatedJsDocTag.text) {
          deprecated = deprecatedJsDocTag.text
        }
      }
    }
    return deprecated
  },

  /**
   * Get's a node or symbol description.
   */
  getDescription(
    typeChecker: ts.TypeChecker,
    nodeOrSymbol: ts.Node | ts.Symbol,
  ): string {
    let description: string = ""
    // todo: provide a type-safe way
    const symbol = (nodeOrSymbol as any)["symbol"]
      ? ((nodeOrSymbol as any)["symbol"] as ts.Symbol)
      : (nodeOrSymbol as ts.Symbol)
    if (symbol) {
      const symbolDescription = ts.displayPartsToString(
        symbol.getDocumentationComment(typeChecker),
      )
      if (symbolDescription) {
        description = symbolDescription
      }
    }

    return description
  },

  /**
   * Finds a property in a given type literal.
   */
  findTypeLiteralProperty(
    node: ts.TypeLiteralNode,
    propertyName: string,
  ): ts.PropertySignature | undefined {
    for (let member of node.members) {
      if (
        ts.isPropertySignature(member) &&
        ts.isIdentifier(member.name) &&
        member.name.text === propertyName
      ) {
        return member
      }
    }
    return undefined
  },
}
