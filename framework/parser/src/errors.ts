import * as ts from "typescript";

/**
 * Errors thrown in the app.
 */
export const Errors = {

    // errors on app file parsing
    appFileInvalid(fileName: string) {
        return new Error(`Cannot find a given "${fileName}" application file. Make sure its a proper TypeScript file.`)
    },
    appFileExportMissing() {
        return new Error(`Your application declaration file must contain a single exported type.`)
    },
    appFileTooManyExports() {
        return new Error(`Your application declaration file must contain only one exported node.`)
    },
    appFileNotTypeAlias() {
        return new Error(`Your application declaration must export a single type created using "ApplicationOptionsOf" type.`)
    },

    // errors on app type parsing
    appTypeNotTypeReference() {
        throw new Error(`Your application declaration must export a single type created using "ApplicationOptionsOf" type.`)
    },
    appTypeNoName() {
        throw new Error(`Your application declaration must export a single type created using "ApplicationOptionsOf" type.`)
    },
    appTypeNotApplicationOptionsOf() {
        throw new Error(`Your application declaration must export a single type created using "ApplicationOptionsOf" type.`)
    },
    appTypeInvalidArguments() {
        throw new Error(`"ApplicationOptionsOf" must define all application options, e.g. ApplicationOptionsOf<{ ...options... }>.`)
    },
    appType() {
        throw new Error(`"ApplicationOptionsOf" must define application options in a following format: ApplicationOptionsOf<{ ...options... }>.`)
    },

    // errors on app models
    appModelsInvalidSignature(node: ts.Node) {
        throw new Error(`"models" inside application options must be an object with models inside, e.g. "models: { User: UserModel, ... }" (kind: ${node.kind}).`)
    },
    appModelsEmptyObject() {
        throw new Error(`"models" inside application options must contain at least one model, e.g. { User: UserModel, ... }.`)
    },

    // errors on models parsing
    signatureNotSupported(node: ts.Node) {
        console.log(node)
        return new Error(`Signature not supported (kind ${node.kind}).`)
    },
    unionTypeDoesNotContainTypes(parent: string) {
        return new Error(`Type "${parent}" does not contain any real type. Most probably you didn't specified anything other than "null" and "undefined" in its type.`)
    },
    emptyGeneratedEnumNameFromStringLiterals(parent: string, literals: string[]) {
        return new Error(`Generated enum name for a string literal "${literals.join(" | ")}" in "${parent}" is empty.`)
    },
    invalidStringLiteralValueForEnumName(parent: string, literal: string) {
        return new Error(`String literal "${literal}" in ${parent} is not valid. It should match /^[_a-zA-Z][_a-zA-Z0-9]*$/.`)
    },
    emptyGeneratedUnionName(parent: string) {
        return new Error(`Generated union name in "${parent}" is empty.`)
    },
    unionTypeFormatNotSupported(parent: string) {
        return new Error(`Union type definition is not supported at "${parent}". Only type references are allowed.`)
    },
    modelClassNoName(parent: string) {
        return new Error(`Class does not have a name${parent ? ` at "${parent}"` : ""}.`)
    },
    modelInterfaceNoName(parent: string) {
        return new Error(`Interface does not have a name${parent ? ` at "${parent}"` : ""}.`)
    },
    typeReferenceInvalidName(parent: string) {
        return new Error(`Invalid type reference name${parent ? ` at "${parent}"` : ""}.`)
    },
    invalidModelSignature(modelName: string, parent: string) {
        return new Error(`Invalid model "${modelName}" signature${parent ? ` at "${parent}"` : ""}.`)
    },
    cannotResolveTypeReference(typeName: string, parent: string) {
        return new Error(`Cannot resolve type of ${typeName}${parent ? ` at "${parent}"` : ""}.`)
    },
    enumPropertyInvalid(parent: string, propertyName: string) {
        return new Error(`Invalid enum value ${propertyName} at ${parent}. Enum value must be initialized and initialized value must be equal to property name. Try to set it to ${propertyName} = "${propertyName}".`)
    },
    enumPropertyMustMatchValue(parent: string, propertyName: string) {
        return new Error(`Invalid enum value ${propertyName} at ${parent}. Enum value must match its property name. Try to set it to ${propertyName} = "${propertyName}".`)
    },

}
