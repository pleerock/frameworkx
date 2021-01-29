import * as ts from "typescript"
import { Errors } from "./errors"
import { DeclarationTypes } from "@microframework/core"

/**
 * Checks if given node is exported or not.
 */
export function isNodeExported(node: ts.Node): boolean {
  return (
    (ts.getCombinedModifierFlags(node as ts.Declaration) &
      ts.ModifierFlags.Export) !==
    0 //||    (!!node.parent && node.parent.kind === ts.SyntaxKind.SourceFile)
  )
}

export function joinStrings(...args: string[]): string {
  return args.filter((str) => str !== "").join(".")
}

/**
 * Checks a given string joined by a "." how many items has.
 */
export function checkPathDeepness(
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
}

/**
 * Gets a deprecation status.
 */
export function getDeprecation(
  nodeOrSymbol: ts.Node | ts.Symbol,
): string | boolean {
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
}

/**
 * Get's a node or symbol description.
 */
export function getDescription(
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
}

/**
 * Finds a property in a given type literal.
 */
export function findTypeLiteralProperty(
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
}

export function declarationPropertyNames(
  type: DeclarationTypes,
  appNode: ts.TypeLiteralNode,
): string[] {
  const declaration = findTypeLiteralProperty(appNode, type)
  if (!declaration) return []

  // make sure signature is supported
  if (!declaration.type || !ts.isTypeLiteralNode(declaration.type))
    throw Errors.appItemInvalidSignature(type, declaration.type)

  // no members - not a problem, user can add them on demand
  if (!declaration.type.members.length) return []

  return declaration.type.members.map((member) => {
    if (!ts.isPropertySignature(member) || !ts.isIdentifier(member.name))
      throw new Error(`invalid property`)
    return member.name.text
  })
}
