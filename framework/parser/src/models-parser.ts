import {MetadataUtils} from "@microframework/core/_";
import * as ts from "typescript";
import {TypeMetadata} from "@microframework/core";
import {ParserOptions} from "./options";

export class ModelParser {

    private program: ts.Program
    private options: ParserOptions
    private typeChecker: ts.TypeChecker

    constructor(program: ts.Program, options: ParserOptions) {
        this.program = program
        this.options = options
        this.typeChecker = program.getTypeChecker()
    }

    /**
     * Parsing has 3 modes:
     *  - "models" - parses all the models down to the deep
     *  - "inputs" - parses all the inputs down to the deep
     *  - "other" -
     *
     *  fromIntersection is used only in exceptional case - when intersection is used -
     *  case where we don't need to ignore properties of the nested named symbols.
     */
    parse(node: ts.Node, parentName: string = "", fromIntersection: boolean = false): TypeMetadata {

        if (node.kind === ts.SyntaxKind.NumberKeyword) {
            return MetadataUtils.createType("number")

        } else if (node.kind === ts.SyntaxKind.StringKeyword) {
            return MetadataUtils.createType("string")

        } else if (node.kind === ts.SyntaxKind.BooleanKeyword) {
            return MetadataUtils.createType("boolean")

        // } else if (ts.isStringLiteral(node)) {
        //     return {
        //         typeName: "string-literal",
        //         value: [],
        //         array: false,
        //         enum: false,
        //         union: false,
        //         nullable: false,
        //         properties: []
        //     }

        } else if (ts.isTypeAliasDeclaration(node)) {
            return this.parse(node.type, parentName)

        } else if (ts.isPropertySignature(node) && node.type) {
            return { ...this.parse(node.type, parentName) }

        } else if (ts.isArrayTypeNode(node)) {
            return { ...this.parse(node.elementType, parentName), array: true }

        } else if (ts.isUnionTypeNode(node)) {
            const nullType = node.types.find(type => type.kind === ts.SyntaxKind.NullKeyword)
            const undefinedType = node.types.find(type => type.kind === ts.SyntaxKind.UndefinedKeyword)
            const typesWithoutNullAndUndefined = node.types.filter(type => type !== nullType && type !== undefinedType)
            /*if (typesWithoutNullAndUndefined.length > 1) {
                throw new Error(`Only "undefined" and "null" types are supported as union type for the given type.`)
            } else */if (typesWithoutNullAndUndefined.length === 0) {
                throw new Error(`Type was not found.`)
            }
            const originalType = typesWithoutNullAndUndefined[0]
            const nullable = nullType !== undefined

            if (typesWithoutNullAndUndefined.length === 1) {
                return { ...this.parse(originalType, parentName), nullable: nullType !== undefined }
            } else {
                const allAllStringLiterals = typesWithoutNullAndUndefined.every(type => {
                    return ts.isLiteralTypeNode(type) && ts.isStringLiteral(type.literal)
                })
                if (allAllStringLiterals) {
                    let typeName = parentName ? this.options.namingStrategy?.enumNameFromStringLiteralUnion(parentName) : ""
                    if (!typeName)
                        throw new Error("Cannot generate union name")

                    const properties = typesWithoutNullAndUndefined.map(type => {
                        if (!ts.isLiteralTypeNode(type) || !ts.isStringLiteral(type.literal))
                            throw new Error("not supported type in union type")
                        if (!type.literal.text.match(/^[_a-zA-Z][_a-zA-Z0-9]*$/))
                            throw new Error(`Provided value "${type.literal.text}" in a string literal type isn't valid. Value must match /^[_a-zA-Z][_a-zA-Z0-9]*$/`)

                        const propertyName = type.literal.text
                        return MetadataUtils.createType("property", { propertyName })
                    })

                    return MetadataUtils.createType("enum", { typeName, nullable, properties })
                }

                const typeName = this.options.namingStrategy?.unionNameFromStringLiteralUnion(parentName) || ""
                const properties = typesWithoutNullAndUndefined.map(type => this.parse(type, parentName))
                return MetadataUtils.createType("union", { typeName, nullable, properties })
            }


        } else if (ts.isTypeLiteralNode(node)) {

            let description = undefined

            // todo: it feels like documentation should be loaded from above?
            if ((node as any).symbol) { // todo: need to find a way to properly check if member has a documentation
                const memberSymbol: ts.Symbol = (node as any).symbol
                description = ts.displayPartsToString(memberSymbol.getDocumentationComment(this.typeChecker))
            }

            return MetadataUtils.createType("object", {
                description,
                properties: this.parseMembers(node.members, parentName),
            })

        } else if (ts.isTypeReferenceNode(node)) {
            const referencedType = this.typeChecker.getTypeAtLocation(node)
            if (!ts.isIdentifier(node.typeName))
                throw new Error(`Name is invalid`)

            let description: string | undefined = undefined

            if (referencedType.aliasSymbol && referencedType.aliasSymbol.name === "Model" && referencedType.aliasTypeArguments) {

                const modelName = node.typeName.text
                const modelSymbol = referencedType.aliasTypeArguments[0].aliasSymbol || referencedType.aliasTypeArguments[0].symbol
                const modelType = modelSymbol ? modelSymbol.declarations[0] : undefined
                const argsSymbol = referencedType.aliasTypeArguments[1].aliasSymbol || referencedType.aliasTypeArguments[1].symbol
                const argsType = argsSymbol ? argsSymbol.declarations[0] : undefined
                if (!modelType)
                    throw new Error("Cannot resolve a type reference")

                // if this is a nested call (this case we'll have a parent name) -
                // we don't go deeper to prevent recursion for named symbols
                if (parentName && !fromIntersection) {
                    // todo: we can remove modelName by introducing a new kind - model
                    return MetadataUtils.createType("model", {
                        modelName,
                        description,
                    })
                }

                const model = this.parse(modelType, this.joinStrings(parentName/*, typeName*/))
                model.description = ts.displayPartsToString(modelSymbol.getDocumentationComment(this.typeChecker))
                // model.typeName = model.typeName
                model.modelName = modelName

                if (argsType) {
                    const argsModel = this.parse(argsType, this.joinStrings(parentName, /*typeName, */"Args"))

                    argsModel.properties.forEach(property => {
                        const modelProperty = model.properties.find(modelProperty => modelProperty.propertyName === property.propertyName)
                        if (!modelProperty)
                            throw new Error(`No property "${property.propertyName}" was found in the "${model.typeName}" model.`)

                        // todo: not sure about kind here
                        modelProperty.args = MetadataUtils.createType(argsModel.kind, {
                            typeName: argsModel.typeName,
                            propertyName: argsModel.propertyName,
                            properties: property.properties,
                        })
                    })
                }

                return model
            }

            const typeName = node.typeName.text

            // const resolvedType = referencedType.symbol ? referencedType.symbol.declarations[0] :
            //     referencedType.aliasSymbol ? referencedType.aliasSymbol.declarations[0] :
            //         undefined

            const symbol = referencedType.aliasSymbol || referencedType.symbol
            let resolvedType = undefined
            if (symbol) {
                resolvedType = symbol.declarations[0]
                description = ts.displayPartsToString(symbol.getDocumentationComment(this.typeChecker))
            }

            // if this is a nested call (this case we'll have a parent name) -
            // we don't go deeper to prevent recursion for named symbols
            if (parentName && !fromIntersection) {
                if (resolvedType && ts.isEnumDeclaration(resolvedType)) {
                    const properties = this.parseMembers(resolvedType.members, typeName)
                    return MetadataUtils.createType("enum", {
                        typeName,
                        description,
                        properties,
                    })
                }

                return MetadataUtils.createType("object", {
                    typeName,
                    description,
                })
            }

            if (!resolvedType)
                throw new Error("Cannot resolve a type reference")

            return {
                ...this.parse(resolvedType, this.joinStrings(parentName, typeName)),
                typeName,
                description,
            }

        } else if (ts.isIntersectionTypeNode(node)) {
            let properties: TypeMetadata[] = []
            node.types.forEach((type: ts.TypeNode) => {
                const parsed = this.parse(type, this.joinStrings(parentName), true)
                properties.push(...parsed.properties)
            })

            return MetadataUtils.createType("object", {
                properties,
            })

        } else if (ts.isClassDeclaration(node)) {
            if (!node.name)
                throw new Error("Class doesn't have a name")

            const typeName = node.name.text
            const properties = parentName && !fromIntersection ? [] : this.parseMembers(node.members, typeName)

            // todo: what about class literal signature, e.g. class { ... }
            // todo: can we send a class reference to be able to create classes furthermore
            return MetadataUtils.createType("object", {
                typeName,
                properties,
            })

        } else if (ts.isInterfaceDeclaration(node)) {
            if (!node.name)
                throw new Error("Interface doesn't have a name")

            const typeName = node.name.text
            const properties = parentName && !fromIntersection ? [] : this.parseMembers(node.members, typeName)

            return MetadataUtils.createType("object", {
                typeName,
                properties,
            })

        } else if (ts.isImportTypeNode(node)) {

            // const referencedType = this.typeChecker.getTypeAtLocation(node)
            if (!node.qualifier || !ts.isIdentifier(node.qualifier))
                throw new Error(`Name is invalid`)
            if (node.qualifier.text !== "Model")
                throw new Error(`Not a Model`)
            if (!node.typeArguments || !node.typeArguments.length)
                throw new Error(`Invalid number of arguments`)

            const model = this.parse(node.typeArguments[0], parentName)
            if (node.typeArguments[1]) {
                // console.log(model);
                const referencedType = this.typeChecker.getTypeAtLocation(node.typeArguments[1])
                if (referencedType && referencedType.aliasSymbol) {
                    const declaration = referencedType.aliasSymbol!.declarations[0]
                    const argsModel = this.parse(declaration, this.joinStrings(parentName, /*typeName, */"Args"))

                    argsModel.properties.forEach(property => {
                        const modelProperty = model.properties.find(modelProperty => modelProperty.propertyName === property.propertyName)
                        if (!modelProperty)
                            throw new Error(`No property "${property.propertyName}" was found in the "${model.typeName}" model.`)

                        // todo: not sure about kind here
                        modelProperty.args = MetadataUtils.createType(argsModel.kind, {
                            typeName: argsModel.typeName,
                            propertyName: argsModel.propertyName,
                            properties: property.properties,
                        })
                    })
                }
            }
            return model

            /*let description: string | undefined = undefined
            if (referencedType.aliasSymbol && referencedType.aliasSymbol.name === "Model" && referencedType.aliasTypeArguments) {

                const modelName = node.typeName.text
                const modelSymbol = referencedType.aliasTypeArguments[0].aliasSymbol || referencedType.aliasTypeArguments[0].symbol
                const modelType = modelSymbol ? modelSymbol.declarations[0] : undefined
                const argsSymbol = referencedType.aliasTypeArguments[1].aliasSymbol || referencedType.aliasTypeArguments[1].symbol
                const argsType = argsSymbol ? argsSymbol.declarations[0] : undefined
                if (!modelType)
                    throw new Error("Cannot resolve a type reference")

                // if this is a nested call (this case we'll have a parent name) -
                // we don't go deeper to prevent recursion for named symbols
                if (parentName && !fromIntersection) {
                    return { typeName: "", properties: [], array: false, modelName, nullable: false, enum: false }
                }

                const model = this.parse(modelType, this.joinStrings(parentName/!*, typeName*!/))
                model.description = ts.displayPartsToString(modelSymbol.getDocumentationComment(this.typeChecker))
                // model.typeName = model.typeName
                model.modelName = modelName

                if (argsType) {
                    const argsModel = this.parse(argsType, this.joinStrings(parentName, /!*typeName, *!/"Args"))

                    argsModel.properties.forEach(property => {
                        const modelProperty = model.properties.find(modelProperty => modelProperty.propertyName === property.propertyName)
                        if (!modelProperty)
                            throw new Error(`No property "${property.propertyName}" was found in the "${model.typeName}" model.`)

                        modelProperty.args = {
                            typeName: argsModel.typeName,
                            propertyName: argsModel.propertyName,
                            properties: property.properties,
                            array: false,
                            enum: false,
                            nullable: false,
                        }
                    })
                }

                return model
            }*/
        }

        console.log(node)
        throw new Error(`Signature is not supported (kind ${node.kind})`)
    }

    private parseMembers(members: ts.NodeArray<ts.Node>, parentName: string): TypeMetadata[] {
        const properties: TypeMetadata[] = []

        members.forEach(member => {
            if (ts.isPropertySignature(member) || ts.isPropertyDeclaration(member) || ts.isEnumMember(member)) {
                if (!member.name)
                    throw new Error("Property doesn't have a name")

                let description = undefined
                if ((member as any).symbol) { // todo: need to find a way to properly check if member has a documentation
                    const memberSymbol: ts.Symbol = (member as any).symbol
                    description = ts.displayPartsToString(memberSymbol.getDocumentationComment(this.typeChecker))
                }

                let propertyName = member.name.getText()
                if (propertyName.substr(0, 1) === `"`) {
                    propertyName = propertyName.substr(1)
                }
                if (propertyName.substr(-1) === `"`) {
                    propertyName = propertyName.substr(0, propertyName.length - 1)
                }

                if (ts.isPropertySignature(member) || ts.isPropertyDeclaration(member)) {
                    if (member.type) {
                        const result = {
                            ...this.parse(member.type, this.joinStrings(parentName, propertyName)),
                            propertyName: propertyName,
                            // description: description,
                        }
                        if (description) {
                            result.description = description
                        }
                        properties.push(result)
                    }
                } else if (ts.isEnumMember(member)) {
                    let value: any = undefined
                    if (!member.initializer) {
                        throw new Error("Each enum property must be initialized, and their initialized value must be equal to property name.")
                    }

                    value = member.initializer.getFullText().trim()
                    const isValueString = value.substr(0, 1) === `"` && value.substr(-1) === `"`
                    if (isValueString) {
                        value = value.substr(1)
                        value = value.substr(0, value.length - 1)
                    }
                    if (propertyName !== value) {
                        throw new Error("Enum's property name must be a value equal to property name.")
                    }

                    // console.log("value", member.initializer!!.getFullText(), value)
                    properties.push(MetadataUtils.createType("object", {
                        propertyName: propertyName,
                        description: description,
                    }))
                }
            }
        })

        return properties
    }

    private joinStrings(...args: string[]) {
        return args
            .filter(str => str !== "")
            .join(".")
    }

}