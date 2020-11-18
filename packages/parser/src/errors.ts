import * as ts from "typescript"
import { DeclarationTypes } from "@microframework/core"

/**
 * Errors thrown in the app.
 */
export const Errors = {
  /**
   * Error thrown on miscellaneous property signature errors.
   */
  propertySignatureInvalid(path: string, debugPath: string) {
    return new Error(
      `Property signature is invalid at ${path} (debug path: ${debugPath})`,
    )
  },

  /**
   * Error thrown when class is nameless.
   */
  modelClassNoName(path: string, debugPath: string) {
    return new Error(
      `Class declaration must have a name at ${path} (${debugPath}).`,
    )
  },

  // errors on app file parsing
  appFileInvalid(fileName: string) {
    return new Error(
      `Cannot find a given "${fileName}" application file. Make sure its a proper TypeScript file.`,
    )
  },
  appFileExportMissing() {
    return new Error(
      `Your application declaration file must contain a single exported type.`,
    )
  },
  appFileTooManyExports() {
    return new Error(
      `Your application declaration file must contain only one exported node.`,
    )
  },
  appFileNotTypeAlias() {
    return new Error(
      `Your application declaration must export a single type created using "ApplicationOptionsOf" type.`,
    )
  },

  // errors on app type parsing
  appTypeNotTypeReference() {
    throw new Error(
      `Your application declaration must export a single type created using "ApplicationOptionsOf" type.`,
    )
  },
  appTypeNoName() {
    throw new Error(
      `Your application declaration must export a single type created using "ApplicationOptionsOf" type.`,
    )
  },
  appTypeNotApplicationOptionsOf() {
    throw new Error(
      `Your application declaration must export a single type created using "ApplicationOptionsOf" type.`,
    )
  },
  appTypeInvalidArguments() {
    throw new Error(
      `"ApplicationOptionsOf" must define all application options, e.g. ApplicationOptionsOf<{ ...options... }>.`,
    )
  },
  appType() {
    throw new Error(
      `"ApplicationOptionsOf" must define application options in a following format: ApplicationOptionsOf<{ ...options... }>.`,
    )
  },

  // errors on app models
  appModelsEmptyObject() {
    throw new Error(
      `"models" inside application options must contain at least one model, e.g. { User: UserModel, ... }.`,
    )
  },

  // errors on app inputs
  appInputsInvalidSignature(node: ts.Node) {
    throw new Error(
      `"inputs" inside application options must be an object with models inside, e.g. "inputs: { UserInput: UserInput, ... }" (kind: ${node.kind}).`,
    )
  },
  appInputsEmptyObject() {
    throw new Error(
      `"inputs" inside application options must contain at least one model, e.g. { UserInput: UserInput, ... }.`,
    )
  },
  appQueriesDuplicate(properties: string[]) {
    throw new Error(
      `"queries" inside application options contains duplicated properties [${properties.join(
        ", ",
      )}]`,
    )
  },
  appMutationsDuplicate(properties: string[]) {
    throw new Error(
      `"mutations" inside application options contains duplicated properties [${properties.join(
        ", ",
      )}]`,
    )
  },
  appSubscriptionsDuplicate(properties: string[]) {
    throw new Error(
      `"subscriptions" inside application options contains duplicated properties [${properties.join(
        ", ",
      )}]`,
    )
  },
  appMissingModelType(
    type: "queries" | "mutations" | "subscriptions" | "actions",
    missingTypes: string[],
  ) {
    throw new Error(
      `Types [${missingTypes.join(
        ", ",
      )}] must be defined in "models" section in order to use ${type}.`,
    )
  },
  appMissingInputType(
    type: "queries" | "mutations" | "subscriptions" | "actions",
    missingTypes: string[],
  ) {
    throw new Error(
      `Types [${missingTypes.join(
        ", ",
      )}] must be defined in "inputs" section in order to use ${type}.`,
    )
  },

  // errors on app actions
  appActionsInvalidSignature(node: ts.Node) {
    throw new Error(
      `"actions" inside application options must be an object with actions inside (kind: ${node.kind}).`,
    )
  },
  appActionsEmptyObject() {
    throw new Error(
      `"actions" inside application options must contain at least one action.`,
    )
  },

  // errors on models parsing
  signatureNotSupported(node: ts.Node) {
    // console.log(node)
    return new Error(`Signature not supported (kind ${node.kind}).`)
  },
  unionTypeDoesNotContainTypes(parent: string) {
    return new Error(
      `Type "${parent}" does not contain any real type. Most probably you didn't specified anything other than "null" and "undefined" in its type.`,
    )
  },
  emptyGeneratedEnumNameFromStringLiterals(parent: string, literals: string[]) {
    return new Error(
      `Generated enum name for a string literal "${literals.join(
        " | ",
      )}" in "${parent}" is empty.`,
    )
  },
  invalidStringLiteralValueForEnumName(parent: string, literal: string) {
    return new Error(
      `String literal "${literal}" in ${parent} is not valid. It should match /^[_a-zA-Z][_a-zA-Z0-9]*$/.`,
    )
  },
  emptyGeneratedUnionName(parent: string) {
    return new Error(`Generated union name in "${parent}" is empty.`)
  },
  unionTypeFormatNotSupported(parent: string) {
    return new Error(
      `Union type definition is not supported at "${parent}". Only type references are allowed.`,
    )
  },
  modelInterfaceNoName(parent: string) {
    return new Error(
      `Interface does not have a name${parent ? ` at "${parent}"` : ""}.`,
    )
  },
  typeReferenceInvalidName(parent: string) {
    return new Error(
      `Invalid type reference name${parent ? ` at "${parent}"` : ""}.`,
    )
  },
  invalidModelSignature(modelName: string, parent: string) {
    return new Error(
      `Invalid model "${modelName}" signature${
        parent ? ` at "${parent}"` : ""
      }.`,
    )
  },
  cannotResolveTypeReference(typeName: string, parent: string) {
    return new Error(
      `Cannot resolve type of ${typeName}${parent ? ` at "${parent}"` : ""}.`,
    )
  },
  enumPropertyInvalid(parent: string, propertyName: string) {
    return new Error(
      `Invalid enum value ${propertyName} at ${parent}. Enum value must be initialized and initialized value must be equal to property name. Try to set it to ${propertyName} = "${propertyName}".`,
    )
  },
  enumPropertyMustMatchValue(parent: string, propertyName: string) {
    return new Error(
      `Invalid enum value ${propertyName} at ${parent}. Enum value must match its property name. Try to set it to ${propertyName} = "${propertyName}".`,
    )
  },
  methodNoReturningType(parent: string, propertyName: string) {
    return new Error(
      `Method ${propertyName} at ${parent} must return some type.`,
    )
  },
  importedNodeNameInvalid(parent: string) {
    return new Error(
      `Imported node's name is invalid${parent ? ` at "${parent}"` : ""}.`,
    )
  },
  importedNodeIsNotModel(parent: string) {
    return new Error(
      `Only "Model" is supported for imported names${
        parent ? ` at "${parent}"` : ""
      }.`,
    )
  },
  importedNodeModelInvalid(parent: string) {
    return new Error(
      `Imported Model doesn't have a valid type arguments${
        parent ? ` at "${parent}"` : ""
      }.`,
    )
  },
  modelArgPropertyInvalid(typeName: string, argPropertyName: string) {
    return new Error(
      `Model Arg "${argPropertyName}" is invalid, because property with such name is missing in "${typeName}".`,
    )
  },

  /**
   * Thrown when there are issues on parsing a specific application declaration.
   */
  appItemInvalidSignature(type: DeclarationTypes, node: ts.Node | undefined) {
    const kindMessage = node ? ` (received kind: ${node.kind})` : ``
    let example = ""
    if (type === "models") {
      example = `{ "models": { User: User, ... } }`
    } else if (type === "inputs") {
      example = `{ "inputs": { UserInput: UserInput, ... } }`
    } else if (type === "queries") {
      example = `{ "queries": { users(): User[], ... } }`
    } else if (type === "mutations") {
      example = `{ "mutations": { userSave(input: UserSaveInput): boolean, ... } }`
    } else if (type === "subscriptions") {
      example = `{ "subscriptions": { onUserRegister(): User, ... } }`
    } else if (type === "actions") {
      example = `{ "actions": { "GET /users": { return: User[] }, ... } }`
    }
    throw new Error(
      `"${type}" inside application options must be a literal object with ${type} inside, ` +
        `e.g. "${example}"${kindMessage}.`,
    )
  },

  /**
   * Thrown in unknown cases when its not possible to parse application declaration type's object members.
   */
  appDeclarationItemInvalidDefinition(type: DeclarationTypes) {
    return new Error(`Application's "${type}" definition is invalid.`)
  },

  /**
   * Thrown when model / input name mismatches the referenced type name.
   * This check is needed to prevent a confusion, when user creates a type and expects
   * to use it's name in methods like "app.resolver(TypeName)" when what he actually must
   * use is a model / input name defined as a key in declaration.
   */
  modelInputKeyNameAndTypeNameMismatch(
    type: "inputs" | "models",
    keyName: string,
    typeReferenceName: string,
  ) {
    const definitionName = type === "models" ? "model" : "input"
    return new Error(
      `App's ${definitionName} "${keyName}" is referenced to a type with a ` +
        `different name("${typeReferenceName}"). In order to prevent a confusion and bugs, ` +
        `please make sure to name both model and referenced type names match.`,
    )
  },
}
