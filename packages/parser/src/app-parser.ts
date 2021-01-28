import {
  ApplicationTypeMetadata,
  TypeMetadataUtils,
} from "@microframework/core"
import * as ts from "typescript"
import * as ParserUtils from "./utils"
import { parseCreateApp } from "./create-app-parser"
import { validateApplicationTypeMetadata } from "./validators"
import { ParserContext } from "./types"
import { parseAppDeclaration } from "./app-declaration-parser"
import { parseAppOptionParts } from "./app-options-parts-parser"

/**
 * Parses metadata from a given ParserContext.
 * ParserContext can be used to pre-define a TypeScript program.
 */
export function parse(context: ParserContext): ApplicationTypeMetadata

/**
 * Parses metadata from a given ParserContext.
 * A new TypeScript program will be created for a given file name.
 */
export function parse(appFileName: string): ApplicationTypeMetadata

/**
 * Parses ApplicationTypeMetadata.
 */
export function parse(
  appFileNameOrContext: string | ParserContext,
): ApplicationTypeMetadata {
  // if context wasn't given by default, create a new one
  let context: ParserContext | undefined
  if (typeof appFileNameOrContext === "string") {
    context = {
      program: ts.createProgram([appFileNameOrContext], {
        target: ts.ScriptTarget.ES5,
        module: ts.ModuleKind.CommonJS,
      }),
      typeNames: [],
      appFileName: appFileNameOrContext,
    }
  } else {
    context = appFileNameOrContext
  }
  const typeChecker = context.program.getTypeChecker()

  // find & parse createApp node
  const { appName, appDescription, appOptionsNode } = parseCreateApp(context)

  // parse app options parts
  const appDeclarationParts = parseAppOptionParts(typeChecker, appOptionsNode)

  // iterate over application declaration parts and collect root model and input names
  for (let part of appDeclarationParts) {
    const inputNames = ParserUtils.declarationPropertyNames("inputs", part)
    const modelNames = ParserUtils.declarationPropertyNames("models", part)
    context.typeNames.push(...inputNames)
    context.typeNames.push(...modelNames)
  }

  // create application type metadata
  const appMetadata = TypeMetadataUtils.createApplicationTypeMetadata(
    appName,
    appDescription,
  )

  // iterate over application declaration parts and parse declaration properties
  for (let part of appDeclarationParts) {
    const models = parseAppDeclaration(context, "models", part)
    const inputs = parseAppDeclaration(context, "inputs", part)
    const queries = parseAppDeclaration(context, "queries", part)
    const mutations = parseAppDeclaration(context, "mutations", part)
    const subscriptions = parseAppDeclaration(context, "subscriptions", part)
    const typeMetadatasOfActions = parseAppDeclaration(context, "actions", part)
    const actions = typeMetadatasOfActions.map((typeMetadata) =>
      TypeMetadataUtils.createActionTypeMetadata(typeMetadata),
    )

    appMetadata.models.push(...models)
    appMetadata.inputs.push(...inputs)
    appMetadata.queries.push(...queries)
    appMetadata.mutations.push(...mutations)
    appMetadata.subscriptions.push(...subscriptions)
    appMetadata.actions.push(...actions)
  }

  // validate application type metadata
  validateApplicationTypeMetadata(appMetadata)

  return appMetadata
}
