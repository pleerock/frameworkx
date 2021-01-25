import * as ts from "typescript"
import * as ParserUtils from "./utils"
import { Errors } from "./errors"
import path from "path"
import { ParserContext } from "./types"

/**
 * Parses createApp<Options> node.
 * Returns parsed options, application name and description.
 */
export function parseCreateApp(
  context: ParserContext,
): {
  appOptionsNode: ts.Node
  appName: string
  appDescription: string
} {
  // find a provided application source file
  const normalizedAppFileName = path.resolve(context.appFileName) // .replace(/\\/g, "/"))
  const appSourceFile = context.program.getSourceFiles().find((file) => {
    return path.resolve(file.fileName) === normalizedAppFileName
  })
  if (!appSourceFile) throw Errors.appFileInvalid(context.appFileName)

  // find all exported nodes from app file
  const exportedNodes = appSourceFile.statements.filter((statement) => {
    return (
      ParserUtils.isNodeExported(statement) && ts.isVariableStatement(statement)
    )
  })

  // validate app file content
  if (!exportedNodes.length) throw Errors.appFileExportMissing()

  if (exportedNodes.length > 1) throw Errors.appFileTooManyExports()

  const node = exportedNodes[0]
  if (!ts.isVariableStatement(node)) throw Errors.appFileNotTypeAlias()

  let appOptionsNode: ts.Node | undefined = undefined // declaration.initializer.typeArguments[0]
  const declaration = node.declarationList.declarations[0]

  if (appSourceFile.isDeclarationFile === false) {
    if (!declaration.initializer) throw new Error("Invalid declarations[0]")

    if (!ts.isCallExpression(declaration.initializer))
      throw new Error("Invalid declaration.initializer")

    if (!ts.isIdentifier(declaration.initializer.expression))
      throw new Error("Invalid declaration.initializer.expression")

    if (declaration.initializer.expression.text !== "createApp")
      throw new Error("Invalid createApp")

    if (!declaration.initializer.typeArguments)
      throw new Error("Invalid typeArguments")

    if (declaration.initializer.typeArguments.length > 1)
      throw new Error("Invalid typeArguments")

    appOptionsNode = declaration.initializer.typeArguments[0]
  } else {
    if (!declaration.type) throw new Error("Invalid declaration type")

    if (!ts.isImportTypeNode(declaration.type))
      throw new Error("Invalid declaration type import")

    if (!declaration.type.typeArguments)
      throw new Error("Invalid typeArguments")

    if (declaration.type.typeArguments.length > 1)
      throw new Error("Invalid typeArguments")

    appOptionsNode = declaration.type.typeArguments[0]
  }

  if (!ts.isIdentifier(declaration.name))
    throw new Error("Invalid declaration.name")

  // todo: find a more reliable way to extract documentation
  let description = ""
  if (
    (node as any).jsDoc &&
    (node as any).jsDoc.length &&
    (node as any).jsDoc[0].comment
  ) {
    description = (node as any).jsDoc[0].comment
  }

  return {
    appDescription: description,
    appName: declaration.name.text,
    appOptionsNode,
  }
}
