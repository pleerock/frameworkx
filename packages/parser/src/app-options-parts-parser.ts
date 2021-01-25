import * as ts from "typescript"
import { Errors } from "./errors"

/**
 * Extracts type literal nodes out of application options defined in the createApp<Options>.
 * Options can be defined as intersection, in this case application options will consist of multiple nodes.
 * If intersection wasn't used, it returns a single type literal node in the array.
 */
export function parseAppOptionParts(
  typeChecker: ts.TypeChecker,
  appOptionsNode: ts.Node,
): ts.TypeLiteralNode[] {
  const appDeclarationParts: ts.TypeLiteralNode[] = []

  if (ts.isIntersectionTypeNode(appOptionsNode)) {
    for (let type of appOptionsNode.types) {
      if (ts.isTypeLiteralNode(type)) {
        appDeclarationParts.push(type)
      } else if (ts.isTypeReferenceNode(type)) {
        const referencedType = typeChecker.getTypeAtLocation(type)
        const symbol = referencedType.aliasSymbol || referencedType.symbol
        if (symbol && symbol.declarations[0]) {
          const declaration = symbol.declarations[0]
          if (ts.isTypeLiteralNode(declaration)) {
            appDeclarationParts.push(declaration)
          } else if (
            ts.isTypeAliasDeclaration(declaration) &&
            ts.isTypeLiteralNode(declaration.type)
          ) {
            appDeclarationParts.push(declaration.type)
          } else {
            throw Errors.appTypeInvalidArguments()
          }
        } else {
          throw Errors.appTypeInvalidArguments()
        }
      } else {
        throw Errors.appTypeInvalidArguments()
      }
    }
  } else {
    if (!ts.isTypeLiteralNode(appOptionsNode))
      throw Errors.appTypeInvalidArguments()

    appDeclarationParts.push(appOptionsNode)
  }

  return appDeclarationParts
}
