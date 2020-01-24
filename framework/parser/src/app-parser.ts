import {
    ActionMetadata,
    ApplicationMetadata,
    DeclarationMetadata,
    SelectionMetadata,
    TypeMetadata
} from "@microframework/core";
import * as ts from "typescript";
import {Errors} from "./errors";
import {ModelParser} from "./models-parser";
import {DefaultParserNamingStrategy} from "./naming-strategy";
import {ParserOptions} from "./options";
import {findTypeLiteralProperty, isNodeExported} from "./utils";

export function parse(appFileName: string, options?: ParserOptions): ApplicationMetadata {

    if (!options) {
        options = {}
    }
    if (!options.namingStrategy) {
        options.namingStrategy = DefaultParserNamingStrategy
    }

    // create a TypeScript program
    const program = ts.createProgram([appFileName], {
        target: ts.ScriptTarget.ES5,
        module: ts.ModuleKind.CommonJS
    });

    // find a provided application source file
    const appSourceFile = program.getSourceFiles().find(file => {
        return file.fileName === appFileName // && file.isDeclarationFile === false
    })
    if (!appSourceFile)
        throw Errors.appFileInvalid(appFileName)

    // find all exported nodes from app file
    const exportedNodes = appSourceFile.statements.filter(statement => {
        return isNodeExported(statement) && ts.isVariableStatement(statement)
    })

    // validate app file content
    if (!exportedNodes.length)
        throw Errors.appFileExportMissing()

    if (exportedNodes.length > 1)
        throw Errors.appFileTooManyExports()

    const node = exportedNodes[0]
    if (!ts.isVariableStatement(node))
        throw Errors.appFileNotTypeAlias()

    let appDefOptions: ts.Node | undefined = undefined // declaration.initializer.typeArguments[0]
    const declaration = node.declarationList.declarations[0]

    if (appSourceFile.isDeclarationFile === false) {

        if (!declaration.initializer)
            throw new Error("Invalid declarations[0]")

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

        appDefOptions = declaration.initializer.typeArguments[0]
    } else {

        if (!declaration.type)
            throw new Error("Invalid declaration type")

        if (!ts.isImportTypeNode(declaration.type))
            throw new Error("Invalid declaration type import")

        if (!declaration.type.typeArguments)
            throw new Error("Invalid typeArguments")

        if (declaration.type.typeArguments.length > 1)
            throw new Error("Invalid typeArguments")

        appDefOptions = declaration.type.typeArguments[0]
    }

    if (!ts.isTypeLiteralNode(appDefOptions))
        throw Errors.appTypeInvalidArguments()

    if (!ts.isIdentifier(declaration.name))
        throw new Error("Invalid declaration.name")

    return {
        name: declaration.name.text,
        actions: parseActions(program, appDefOptions, options),
        models: parseModels(program, appDefOptions, options),
        inputs: parseInputs(program, appDefOptions, options),
        queries: parseQueries(program, appDefOptions, options),
        mutations: parseMutations(program, appDefOptions, options),
        subscriptions: [], // parseMutations(program, appDefOptions, options),
        selections: parseSelections(program, appDefOptions, options),
    }
}

function parseActions(program: ts.Program, appDefOptions: ts.TypeLiteralNode, options: ParserOptions): ActionMetadata[] {
    const actionsMember = findTypeLiteralProperty(appDefOptions, "actions")

    if (!actionsMember)
        return []

    if (!actionsMember.type)
        throw new Error("no type")

    if (!ts.isTypeLiteralNode(actionsMember.type))
        throw Errors.appModelsInvalidSignature(actionsMember.type)

    if (!actionsMember.type.members.length)
        throw Errors.appModelsEmptyObject()

    const modelParser = new ModelParser(program, options)
    const actions = modelParser.parse(actionsMember.type)
    return actions.properties.map(action => {
        if (!action.propertyName)
            throw new Error("Property name was not set in the action")

        const returning = action.properties.find(property => property.propertyName === "return")
        if (!returning)
            throw new Error(`Returning was not found in the action ${action.propertyName}`)

        const query = action.properties.find(property => property.propertyName === "query")
        const params = action.properties.find(property => property.propertyName === "params")
        const headers = action.properties.find(property => property.propertyName === "headers")
        const cookies = action.properties.find(property => property.propertyName === "cookies")
        const body = action.properties.find(property => property.propertyName === "body")

        return {
            name: action.propertyName,
            return: { ...returning, propertyName: "" },
            query,
            params,
            headers,
            cookies,
            body,
        }
    })
}

function parseModels(program: ts.Program, appDefOptions: ts.TypeLiteralNode, options: ParserOptions): TypeMetadata[] {
    const modelsMember = findTypeLiteralProperty(appDefOptions, "models")

    if (!modelsMember)
        throw new Error("no member")

    if (!modelsMember.type)
        throw new Error("no type")

    if (!modelsMember.type || !ts.isTypeLiteralNode(modelsMember.type))
        throw Errors.appModelsInvalidSignature(modelsMember.type)

    if (!modelsMember.type.members.length)
        throw Errors.appModelsEmptyObject()

    const modelParser = new ModelParser(program, options)
    return modelsMember.type.members.map(member => modelParser.parse(member))
}

function parseInputs(program: ts.Program, appDefOptions: ts.TypeLiteralNode, options: ParserOptions): TypeMetadata[] {
    const modelsMember = findTypeLiteralProperty(appDefOptions, "inputs")

    if (!modelsMember)
        return []
        // throw Errors.appModelsInvalidSignature()

    if (!modelsMember.type)
        throw new Error("no type")

    if (!ts.isTypeLiteralNode(modelsMember.type))
        throw Errors.appModelsInvalidSignature(modelsMember.type)

    if (!modelsMember.type.members.length)
        throw Errors.appModelsEmptyObject()

    const modelParser = new ModelParser(program, options)
    return modelsMember.type.members.map(member => modelParser.parse(member))
}

// todo: use same approach as in "actions"
function parseQueries(program: ts.Program, appDefOptions: ts.TypeLiteralNode, options: ParserOptions): DeclarationMetadata[] {
    const modelsMember = findTypeLiteralProperty(appDefOptions, "queries")

    if (!modelsMember)
        return []
        // throw Errors.appModelsInvalidSignature()

    if (!modelsMember.type)
        throw new Error("no type")

    if (ts.isTypeLiteralNode(modelsMember.type)) {
        if (!modelsMember.type.members.length)
            throw Errors.appModelsEmptyObject()

        return modelsMember.type.members.map(member => parseQuery(program, member, options))

    } else if (ts.isIntersectionTypeNode(modelsMember.type)) {
        const metadatas: DeclarationMetadata[] = []
        modelsMember.type.types.forEach(type => {

            if (!ts.isTypeLiteralNode(type))
                throw Errors.appModelsInvalidSignature(type)

            if (!type.members.length)
                throw Errors.appModelsEmptyObject()

            metadatas.push(...type.members.map(member => parseQuery(program, member, options)))
        })
        return metadatas
    }
    throw Errors.appModelsInvalidSignature(modelsMember.type)
}

function parseMutations(program: ts.Program, appDefOptions: ts.TypeLiteralNode, options: ParserOptions): DeclarationMetadata[] {
    const modelsMember = findTypeLiteralProperty(appDefOptions, "mutations")

    if (!modelsMember)
        return []
        // throw Errors.appModelsInvalidSignature()

    if (!modelsMember.type)
        throw new Error("no type")

    if (ts.isTypeLiteralNode(modelsMember.type)) {
        if (!modelsMember.type.members.length)
            throw Errors.appModelsEmptyObject()

        return modelsMember.type.members.map(member => parseQuery(program, member, options))

    } else if (ts.isIntersectionTypeNode(modelsMember.type)) {
        modelsMember.type.types.forEach(type => {

            if (!ts.isTypeLiteralNode(type))
                throw Errors.appModelsInvalidSignature(type)

            if (!type.members.length)
                throw Errors.appModelsEmptyObject()

            return type.members.map(member => parseQuery(program, member, options))
        })
    }
    throw Errors.appModelsInvalidSignature(modelsMember.type)
}

function parseSelections(program: ts.Program, appDefOptions: ts.TypeLiteralNode, options: ParserOptions) {
    const modelsMember = findTypeLiteralProperty(appDefOptions, "selections")

    if (!modelsMember)
        return []
        // throw Errors.appModelsInvalidSignature()

    if (!modelsMember.type)
        throw new Error("no type")

    if (!ts.isTypeLiteralNode(modelsMember.type))
        throw Errors.appModelsInvalidSignature(modelsMember.type)

    if (!modelsMember.type.members.length)
        throw Errors.appModelsEmptyObject()

    return modelsMember.type.members.map(member => parseSelection(program, member, options))
}

export function parseQuery(program: ts.Program, member: ts.TypeElement, options: ParserOptions): DeclarationMetadata {

    if (!ts.isMethodSignature(member))
        throw new Error(`query must be a method declaration.`)
    if (!ts.isPropertyName(member.name))
        throw new Error(`must be a property name.`)
    if (!member.type)
        throw new Error(`query must return a model`)

    const modelParser = new ModelParser(program, options)
    const typeChecker = program.getTypeChecker()

    let args: TypeMetadata | undefined = undefined
    if (member.parameters.length > 0) {
        if (ts.isParameter(member.parameters[0]) && member.parameters[0].type) {
            args = modelParser.parse(member.parameters[0].type)
        }
    }

    // get method description
    const referencedType = typeChecker.getTypeAtLocation(member)
    const symbol = referencedType.aliasSymbol || referencedType.symbol
    const description = ts.displayPartsToString(symbol.getDocumentationComment(typeChecker))

    return {
        name: member.name.getText(),
        description,
        returnModel: modelParser.parse(member.type),
        args,
    }
}

export function parseSelection(program: ts.Program, member: ts.TypeElement, options: ParserOptions): SelectionMetadata {
    if (!ts.isPropertySignature(member))
        throw new Error(`Each model inside "models" must be a valid property referencing to a valid Model type, e.g. { user: UserModel, ... }.`)
    if (!ts.isIdentifier(member.name))
        throw new Error(`Each model inside "models" must be a valid name in it's definition, e.g. { user: UserModel, ... }.`)
    if (!member.type || !ts.isTypeReferenceNode(member.type))
        throw new Error(`Each model inside "models" must be a valid type in it's definition, e.g. { user: UserModel, ... }.`)
    if (!ts.isIdentifier(member.type.typeName))
        throw new Error(`Each model inside "models" must be a valid type name in it's definition, e.g. { user: UserModel, ... }.`)
    if (!member.type.typeArguments || member.type.typeArguments.length !== 2)
        throw new Error("SelectionOf must define 2 arguments")

    const sourceModelParser = new ModelParser(program, options)
    const selectionModelParser = new ModelParser(program, options)
    return {
        source: sourceModelParser.parse(member.type.typeArguments[0]),
        selection: selectionModelParser.parse(member.type.typeArguments[1]),
    }
}
