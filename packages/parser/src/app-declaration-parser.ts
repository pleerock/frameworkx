import { TypeMetadata, TypeMetadataUtils } from "@microframework/core"
import * as ts from "typescript"
import { Errors } from "./errors"
import * as ParserUtils from "./utils"
import { ParserContext } from "./types"

/**
 * Parses any declaration.
 * Used to parse models, inputs, queries, mutations, subscriptions, actions.
 */
export function parseAppDeclaration(
  context: ParserContext,
  type:
    | "models"
    | "inputs"
    | "queries"
    | "mutations"
    | "subscriptions"
    | "actions",
  appNode: ts.TypeLiteralNode,
): TypeMetadata[] {
  let node: any = ParserUtils.findTypeLiteralProperty(appNode, type)
  if (!node) return []

  const replaceReferencesOnParentDeepnessLevel =
    type === "models" || type === "inputs" ? 2 : 1

  if (type === "actions") {
    // make sure signature is supported
    if (!node.type || !ts.isTypeLiteralNode(node.type))
      throw Errors.appItemInvalidSignature(type, node.type)

    // no members - not a problem, nothing to do here
    if (!node.type.members.length) return []

    node = node.type
  }

  const parser = new Parser(context, replaceReferencesOnParentDeepnessLevel)
  return parser.parse({
    node: node,
    parentName: "",
    debugPath: "app." + type,
    parentType: "literal",
  }).properties
}

// ------------------------------------------------------------
// Local functions
// ------------------------------------------------------------

class Parser {
  constructor(
    private context: ParserContext,
    private replaceReferencesOnParentDeepnessLevel: number,
  ) {}

  parse({
    node,
    parentName,
    debugPath,
    parentType,
  }: {
    node: ts.Node
    parentName: string
    debugPath: string
    parentType: ParentType
  }): TypeMetadata {
    // console.log(`[${parentType}] debug path: ${debugPath}`)
    if (node.kind === ts.SyntaxKind.NumberKeyword) {
      return TypeMetadataUtils.create("number", {
        propertyPath: parentName,
      })
    } else if (node.kind === ts.SyntaxKind.BigIntKeyword) {
      return TypeMetadataUtils.create("bigint", {
        propertyPath: parentName,
      })
    } else if (node.kind === ts.SyntaxKind.StringKeyword) {
      return TypeMetadataUtils.create("string", {
        propertyPath: parentName,
      })
    } else if (node.kind === ts.SyntaxKind.BooleanKeyword) {
      return TypeMetadataUtils.create("boolean", {
        propertyPath: parentName,
      })
    } else if (ts.isPropertySignature(node)) {
      if (!node.type)
        throw Errors.propertySignatureInvalid(parentName, debugPath)
      return this.parse({
        node: node.type,
        parentName: parentName,
        parentType: parentType,
        debugPath: `${debugPath}.propertySignature(${node.name.getText()})`,
      })
    } else if (ts.isParenthesizedTypeNode(node)) {
      return this.parse({
        node: node.type,
        parentName: parentName,
        parentType: parentType,
        debugPath: `${debugPath}.parenthesized`,
      })
    } else if (ts.isArrayTypeNode(node)) {
      return {
        ...this.parse({
          node: node.elementType,
          parentName: parentName,
          parentType: parentType,
          debugPath: `${debugPath}.array`,
        }),
        array: true,
      }
    } else if (ts.isTypeLiteralNode(node)) {
      return TypeMetadataUtils.create("object", {
        properties: this.parseMembers({
          members: node.members,
          parentName: parentName,
          parentType: "literal",
          debugPath: `${debugPath}.literal`,
        }),
        propertyPath: parentName,
      })
    } else if (ts.isEnumDeclaration(node)) {
      return TypeMetadataUtils.create("enum", {
        properties: this.parseMembers({
          members: node.members,
          parentName: parentName,
          parentType: "enum",
          debugPath: `${debugPath}.enum`,
        }),
        propertyPath: parentName,
      })
    } else if (ts.isIntersectionTypeNode(node)) {
      const properties: TypeMetadata[] = []
      for (let type of node.types) {
        const parsed = this.parse({
          node: type,
          parentName: parentName,
          parentType: "intersection",
          debugPath: `${debugPath}.intersection`,
        })

        // we only support objects in intersection types
        if (parsed.kind !== "object")
          throw Errors.intersectionInvalid(parentName, debugPath)

        properties.push(...parsed.properties)
      }

      return TypeMetadataUtils.create("object", {
        properties,
        propertyPath: parentName,
      })
    } else if (ts.isClassLike(node)) {
      // get the class name
      let typeName: string | undefined = undefined
      if (node.name && this.context.typeNames.includes(node.name.text)) {
        typeName = node.name.text
      }

      // if there is a typeName, check if there is a reference to this type
      if (typeName) {
        const reference = this.findReference({
          parentName,
          parentType,
          typeName,
        })
        if (reference) return reference
      }

      return TypeMetadataUtils.create("object", {
        typeName,
        propertyPath: parentName,
        properties: this.parseMembers({
          members: node.members,
          parentName: parentName,
          parentType: "class",
          debugPath: `${debugPath}.class`,
        }),
      })
    } else if (ts.isInterfaceDeclaration(node)) {
      // get the interface name
      let typeName: string | undefined = undefined
      if (this.context.typeNames.includes(node.name.text)) {
        typeName = node.name.text
      }

      // if there is a typeName, check if there is a reference to this type
      if (typeName) {
        const reference = this.findReference({
          parentName,
          parentType,
          typeName,
        })
        if (reference) return reference
      }

      return TypeMetadataUtils.create("object", {
        typeName,
        propertyPath: parentName,
        properties: this.parseMembers({
          members: node.members,
          parentName: parentName,
          parentType: "interface",
          debugPath: `${debugPath}.interface`,
        }),
      })
    } else if (ts.isEnumMember(node)) {
      if (!node.initializer)
        throw Errors.enumMemberInvalid(parentName, debugPath)

      const initializerName = node.initializer.getText().trim()
      const propertyName = this.normalizeTextSymbol(initializerName)

      return TypeMetadataUtils.create("object", {
        propertyName,
        propertyPath: ParserUtils.joinStrings(parentName, propertyName),
      })
    } else if (ts.isUnionTypeNode(node)) {
      // there are different union cases which lead to many different output types
      // such union cases examples:
      // { name: string | undefined } union which must lead to "string" kind
      // { money: bigint | null } union which must lead to "bigint" kind
      // { active: boolean | null | undefined } union which must lead to "boolean" kind
      // { age: 18 | 19 | 20 } union which must lead to "number" kind
      // { active: true | false } union which must lead to "boolean" kind
      // { status: "active" | "inactive" } union which must lead to "enum" kind
      // { education: School | University  } union which must lead to "union" kind
      // etc.

      // extract information about nullability and undefined-ability
      let nullType = node.types.find(
        (type) => type.kind === ts.SyntaxKind.NullKeyword,
      )
      let undefinedType = node.types.find(
        (type) => type.kind === ts.SyntaxKind.UndefinedKeyword,
      )
      let typesWithoutNullAndUndefined = node.types.filter(
        (type) => type !== nullType && type !== undefinedType,
      )

      // typescript 4.0 changes (https://github.com/microsoft/TypeScript/issues/40258)
      const literalType = node.types.find(
        (type) => type.kind === ts.SyntaxKind.LiteralType,
      )
      if (literalType && ts.isLiteralTypeNode(literalType)) {
        if (literalType.literal.kind === ts.SyntaxKind.NullKeyword) {
          nullType = literalType.literal as any
          typesWithoutNullAndUndefined = typesWithoutNullAndUndefined.filter(
            (type) => type !== literalType,
          )
        }
        if (literalType.literal.kind === ts.SyntaxKind.UndefinedKeyword) {
          undefinedType = literalType.literal as any
          typesWithoutNullAndUndefined = typesWithoutNullAndUndefined.filter(
            (type) => type !== literalType,
          )
        }
      }

      const nullable = nullType !== undefined
      const canBeUndefined = undefinedType !== undefined

      // this can only mean specified type was just "null", "undefined" or both
      if (typesWithoutNullAndUndefined.length === 0) {
        throw Errors.unionDoesNotContainTypes(parentName)
      }

      // this means union type isn't real union type - its just a specific type that is also "undefined" and / or "null"
      // examples: "user: User | null", "photo: Photo | undefined", "counter: number | null | undefined"
      if (typesWithoutNullAndUndefined.length === 1) {
        const metadata = this.parse({
          node: typesWithoutNullAndUndefined[0],
          parentName: parentName,
          parentType: "union",
          debugPath: `${debugPath}.union`,
        })
        metadata.nullable = nullable
        metadata.canBeUndefined = canBeUndefined
        return metadata
      }

      // if union consist of numbers - we just map it to the regular "number" kind
      const allAllNumberLiterals = typesWithoutNullAndUndefined.every(
        (type) => {
          return ts.isLiteralTypeNode(type) && ts.isNumericLiteral(type.literal)
        },
      )
      if (allAllNumberLiterals) {
        return TypeMetadataUtils.create("number", {
          nullable,
          canBeUndefined,
          propertyPath: parentName,
        })
      }

      // if union consist of bigints - we just map it to the regular "bigint" kind
      const allAllBigIntLiterals = typesWithoutNullAndUndefined.every(
        (type) => {
          return ts.isLiteralTypeNode(type) && ts.isBigIntLiteral(type.literal)
        },
      )
      if (allAllBigIntLiterals) {
        return TypeMetadataUtils.create("bigint", {
          nullable,
          canBeUndefined,
          propertyPath: parentName,
        })
      }

      // if union consist of booleans - we just map it to the regular "boolean" kind
      const allAllBooleanLiterals = typesWithoutNullAndUndefined.every(
        (type) => {
          return (
            ts.isLiteralTypeNode(type) &&
            (type.literal.kind === ts.SyntaxKind.TrueKeyword ||
              type.literal.kind === ts.SyntaxKind.FalseKeyword)
          )
        },
      )
      if (allAllBooleanLiterals) {
        return TypeMetadataUtils.create("boolean", {
          nullable,
          canBeUndefined,
          propertyPath: parentName,
        })
      }

      // if union consist of strings - we create an enum (maaaagic)
      const allAllStringLiterals = typesWithoutNullAndUndefined.every(
        (type) => {
          return ts.isLiteralTypeNode(type) && ts.isStringLiteral(type.literal)
        },
      )
      if (allAllStringLiterals) {
        // extract all literal strings and make sure they are valid for enum values
        const literals = typesWithoutNullAndUndefined.map((type) => {
          // this is not possible case, since there is a check above ^
          if (!ts.isLiteralTypeNode(type) || !ts.isStringLiteral(type.literal))
            return ""

          // make sure name matches enum name requirements
          if (!TypeMetadataUtils.isNameValid(type.literal.text))
            throw Errors.stringLiteralValueForEnumNameInvalid(
              parentName,
              type.literal.text,
            )

          return type.literal.text
        })

        return TypeMetadataUtils.create("enum", {
          nullable,
          canBeUndefined,
          properties: literals.map((literal) => {
            return TypeMetadataUtils.create("property", {
              propertyName: literal,
              propertyPath: ParserUtils.joinStrings(parentName, literal),
            })
          }),
          propertyPath: parentName,
        })
      }

      // make sure every type in the union is reference to some other type
      const nonTypeReferences = typesWithoutNullAndUndefined.filter((type) => {
        return !ts.isTypeReferenceNode(type)
      })
      if (nonTypeReferences.length > 0) {
        throw Errors.unionDeclarationNotSupported(parentName, [])
      }

      // finally create a union type for type references
      const properties = typesWithoutNullAndUndefined.reduce(
        (all, type, index) => {
          const result = this.parse({
            node: type,
            parentName: ParserUtils.joinStrings(parentName, `${index}`),
            parentType: "union",
            debugPath: `${debugPath}[${index}].union`,
          })
          if (result.kind === "union") {
            return [...all, ...result.properties]
          }
          return [...all, result]
        },
        [] as TypeMetadata[],
      )

      // in the case if all properties are "enums", user declared a union consist of enums, e.g.
      // status: PostUserStatuses | PostAdminStatuses
      // we create a enum with merged properties instead of union
      const areAllPropertiesEnums = properties.every((metadata) => {
        return metadata.kind === "enum"
      })
      if (areAllPropertiesEnums) {
        const enumPropertiesFromAllEnums: TypeMetadata[] = []
        properties.forEach((property) => {
          enumPropertiesFromAllEnums.push(...property.properties)
        })

        return TypeMetadataUtils.create("enum", {
          nullable,
          canBeUndefined,
          properties: enumPropertiesFromAllEnums,
          propertyPath: parentName,
        })
      }

      // last case, union consisting of references to other types
      // there is a requirement for those types to be registered in the app models / inputs
      // (otherwise it doesn't make sense to generate a type name for such union,
      //  because user most likely will use union reference in the code, but generated name can't be used)
      const missingPropertiesInTypes = properties.filter((metadata) => {
        if (!metadata.typeName) return true
        if (!this.context.typeNames.includes(metadata.typeName)) return true

        return false
      })
      if (missingPropertiesInTypes.length) {
        const missingPropertyNames = missingPropertiesInTypes
          .map((metadata) => metadata.typeName)
          .filter((name) => !!name) as string[]
        throw Errors.unionDeclarationNotSupported(
          parentName,
          missingPropertyNames,
        )
      }
      return TypeMetadataUtils.create("union", {
        // typeName,
        nullable,
        canBeUndefined,
        properties,
        propertyPath: parentName,
      })
    } else if (ts.isTypeAliasDeclaration(node)) {
      const type = this.parse({
        node: node.type,
        parentName: parentName,
        parentType: parentType,
        debugPath: `${debugPath}.typeAlias(${node.name.text})`,
      })
      // in type aliases type is declared as: type User = { ... }
      // we have everything parsed from { ... }, but we don't really have a type name
      // that's why we append it here, but only if name was declared in the models / inputs
      if (!type.typeName && this.context.typeNames.includes(node.name.text)) {
        type.typeName = node.name.text
      }

      // todo: check why this block was needed, and uncomment or remove
      // if this is a second-level node, e.g. { models: { User: User } }
      //                                      first level ^     ^ second level
      // we need to check if a first level and second level names matches,
      // for example: { models: { User: UserType } } is invalid signature.
      // in cases where second level is a literal, everything is fine, we accept such case
      // and use a first-level name as a typeName
      // if (
      //   type.typeName &&
      //   !type.propertyPath &&
      //   ParserUtils.checkPathDeepness(parentName, {
      //     regular: 1,
      //     args: 1,
      //   })
      // ) {
      //   type.propertyPath = ParserUtils.joinStrings(
      //     type.propertyPath,
      //     type.typeName,
      //   )
      // }

      return type
    } else if (ts.isTypeReferenceNode(node) || ts.isTypeQueryNode(node)) {
      const nodeName = ts.isTypeReferenceNode(node)
        ? node.typeName
        : node.exprName
      if (!ts.isIdentifier(nodeName) || !nodeName.text)
        throw Errors.typeReferenceInvalidName(parentName)

      const referencedType = this.context.program
        .getTypeChecker()
        .getTypeAtLocation(node)

      // this is a special handling section for Model definitions
      if (
        referencedType.aliasSymbol &&
        referencedType.aliasSymbol.name === "ModelWithArgs" &&
        referencedType.aliasTypeArguments
      ) {
        // extract model's type and args information
        const modelName = nodeName.text
        const modelSymbol =
          referencedType.aliasTypeArguments[0].aliasSymbol ||
          referencedType.aliasTypeArguments[0].symbol
        const modelType = modelSymbol ? modelSymbol.declarations[0] : undefined
        const argsSymbol =
          referencedType.aliasTypeArguments[1].aliasSymbol ||
          referencedType.aliasTypeArguments[1].symbol
        const argsType = argsSymbol ? argsSymbol.declarations[0] : undefined
        if (!modelType)
          throw Errors.invalidModelSignature(modelName, parentName)

        // if this is a nested call (in case we'll have a parent name) -
        // we don't go deeper to prevent recursion for named symbols
        // const existType = context.typeNames.find((type) => type === modelName)
        // if (existType) {
        //   return TypeMetadataUtils.create("model", {
        //     modelName,
        //   })
        // }

        const model = this.parseModel({
          parentName: parentName,
          parentType: parentType,
          modelName: modelName,
          modelType: modelType,
          argsType: argsType,
          debugPath: debugPath,
        })
        model.description = ParserUtils.getDescription(
          this.context.program.getTypeChecker(),
          modelSymbol,
        )
        model.deprecated = ParserUtils.getDeprecation(modelSymbol)

        // if there is a typeName, check if there is a reference to this type
        if (model.typeName) {
          const reference = this.findReference({
            parentName,
            parentType,
            typeName: model.typeName,
          })
          if (reference) return reference
        }

        // todo: do we need to search references before returning?
        return model
      }

      // extract information out of type reference
      const typeName = nodeName.text

      // if there is no parent name here, it means this is a root models and inputs
      // and we must create a type out of it, we cannot have a root objects as references
      // example: { models: { User: User } } -> in this example we cannot make User as a reference
      // otherwise we'll never get an object structure of a User object
      // that's why we have a check for parentName here
      // if there is a typeName, check if there is a reference to this type
      const reference = this.findReference({
        parentName,
        parentType,
        typeName: typeName,
      })
      if (reference) return reference

      const symbol = referencedType.aliasSymbol || referencedType.symbol
      let resolvedType = undefined
      let description: string = ""
      let deprecated: string | boolean = false
      if (symbol) {
        resolvedType = symbol.declarations[0]
        description = ParserUtils.getDescription(
          this.context.program.getTypeChecker(),
          symbol,
        )
        deprecated = ParserUtils.getDeprecation(symbol)
      }

      // check if typeName is a BigInt, we create a "bigint" primitive
      if (typeName === "BigInt") {
        return TypeMetadataUtils.create("bigint", {
          description,
          deprecated,
          propertyPath: parentName,
        })
      }

      // check if it's a reference to a default scalars we have
      if (
        typeName === "Float" ||
        typeName === "Time" ||
        typeName === "Date" ||
        typeName === "DateTime"
      ) {
        return TypeMetadataUtils.create("object", {
          typeName,
          description,
          deprecated,
          propertyPath: parentName,
        })
      }

      if (!resolvedType) {
        throw Errors.cannotResolveTypeReference(typeName, parentName)
      }

      const type = this.parse({
        node: resolvedType,
        parentName: parentName,
        parentType: parentType,
        debugPath: `${debugPath}.typeReferenceNode(${nodeName.getText()})`,
      })

      // in type aliases type is declared as:
      // class User { ... }
      // here, we have everything parsed from { ... }, but we don't really have a type name
      // that's why we append it here
      if (this.context.typeNames.includes(typeName)) {
        type.typeName = typeName
      }

      // todo: suspicious logic, check if we need it
      if (!type.description) {
        type.description = description
      }
      if (!type.deprecated) {
        type.deprecated = deprecated
      }

      return type
    } else if (ts.isImportTypeNode(node)) {
      // check if we can handle this import
      if (!node.qualifier || !ts.isIdentifier(node.qualifier))
        throw Errors.importedNodeNameInvalid(parentName)
      if (node.qualifier.text !== "ModelWithArgs")
        throw Errors.importedNodeIsNotModel(parentName)
      if (!node.typeArguments || !node.typeArguments.length)
        throw Errors.importedNodeModelInvalid(parentName)

      // find model
      let modelType: ts.Node | undefined = undefined
      const modelSymbol = this.context.program
        .getTypeChecker()
        .getTypeAtLocation(node.typeArguments[0])
      if (modelSymbol.symbol) {
        modelType = modelSymbol.symbol.declarations[0]
      }
      if (!modelType) throw Errors.importedNodeModelInvalid(parentName)

      // find args
      let argsType: ts.Node | undefined = undefined
      if (node.typeArguments[1]) {
        const symbol = this.context.program
          .getTypeChecker()
          .getTypeAtLocation(node.typeArguments[1])
        if (symbol.aliasSymbol) {
          argsType = symbol.aliasSymbol.declarations[0]
        }
      }

      const model = this.parseModel({
        parentName: "",
        parentType: "literal",
        modelName: "",
        modelType: modelType,
        argsType: argsType,
        debugPath: debugPath,
      })
      model.description = ParserUtils.getDescription(
        this.context.program.getTypeChecker(),
        modelSymbol.symbol,
      )
      model.deprecated = ParserUtils.getDeprecation(modelSymbol.symbol)
      return model // todo: weirdness
    }

    throw Errors.signatureNotSupported(node)
  }

  private parseModel({
    parentName,
    parentType,
    modelName,
    modelType,
    argsType,
    debugPath,
  }: {
    parentName: string
    parentType: ParentType
    modelName: string
    modelType: ts.Node
    argsType: ts.Node | undefined
    debugPath: string
  }) {
    // create a model with a type
    const model = this.parse({
      node: modelType,
      parentName: parentName,
      parentType: parentType,
      debugPath: `${debugPath}.parseModel(${modelName})`,
    })
    model.modelName = modelName

    // create args if model with args
    if (argsType) {
      const argsModel = this.parse({
        node: argsType,
        parentName: ParserUtils.joinStrings(parentName, /*typeName, */ "Args"),
        parentType: "literal",
        debugPath: `${debugPath}.parseModel(args)(${modelName})`,
      })

      argsModel.properties.forEach((property) => {
        const modelProperty = model.properties.find(
          (modelProperty) =>
            modelProperty.propertyName === property.propertyName,
        )
        if (!modelProperty) {
          throw Errors.modelArgPropertyInvalid(
            model.typeName!,
            property.propertyName!,
          )
        }

        modelProperty.args = [
          TypeMetadataUtils.create(argsModel.kind, {
            typeName: argsModel.typeName,
            propertyName: argsModel.propertyName,
            propertyPath: ParserUtils.joinStrings(
              parentName,
              "Args",
              modelProperty.propertyName!,
            ),
            properties: property.properties,
          }),
        ]
      })
    }

    return model
  }

  private parseMembers({
    members,
    parentName,
    parentType,
    debugPath,
  }: {
    members: ts.NodeArray<ts.Node>
    parentName: string
    parentType: ParentType
    debugPath: string
  }): TypeMetadata[] {
    const properties: TypeMetadata[] = []
    for (let member of members) {
      // skip what we don't support
      if (
        !ts.isPropertySignature(member) &&
        !ts.isPropertyDeclaration(member) &&
        !ts.isEnumMember(member) &&
        !ts.isMethodSignature(member)
      ) {
        throw new Error(`Property syntax isn't supported at ...`)
      }
      if (!member.name) throw new Error(`Property signature is missing at ...`)

      // get property name, description, deprecation
      const rawMemberName = member.name.getText()
      const propertyName = this.normalizeTextSymbol(rawMemberName)
      const description = ParserUtils.getDescription(
        this.context.program.getTypeChecker(),
        member,
      )
      const deprecated = ParserUtils.getDeprecation(member)
      let result: TypeMetadata | undefined = undefined

      // "parseMembers" is called not only for a object literal properties or class properties,
      // but also for an enum, that's why we need this isEnumMember check here.
      if (ts.isEnumMember(member)) {
        const parsed = this.parse({
          node: member,
          parentName: parentName,
          parentType: parentType,
          debugPath: debugPath,
        })
        if (propertyName !== parsed.propertyName) {
          throw Errors.enumMemberNameMismatch(
            parentName,
            propertyName,
            debugPath,
          )
        }

        result = { ...parsed }
      } else {
        if (!member.type)
          throw Errors.methodNoReturningType(parentName, propertyName)

        // if property is a method (e.g. posts(args: {...})), we also parse its arguments
        if (ts.isMethodSignature(member)) {
          result = TypeMetadataUtils.create("function", {
            propertyName,
            propertyPath: ParserUtils.joinStrings(parentName, propertyName),
            returnType: this.parse({
              node: member.type,
              parentName: ParserUtils.joinStrings(
                parentName,
                propertyName,
                "Return",
              ),
              parentType: "function",
              debugPath: `${debugPath}.parseMembers(${propertyName})(Return)`,
            }),
            args: member.parameters.map((parameter) => {
              if (!ts.isParameter(parameter) || !parameter.type)
                throw new Error(`Method parameter ${propertyName} isn't valid.`)

              return this.parse({
                node: parameter.type,
                parentName: ParserUtils.joinStrings(
                  parentName,
                  propertyName,
                  "Args",
                ),
                parentType: parentType,
                debugPath: `${debugPath}.parseMembers(${propertyName})(Args)`,
              })
            }),
          })
        } else {
          // otherwise it's just a property, e.g. { id: number }
          result = {
            ...this.parse({
              node: member.type,
              parentName: ParserUtils.joinStrings(parentName, propertyName),
              parentType: parentType,
              debugPath: `${debugPath}.parseMembers(${propertyName})`,
            }),
            propertyName,
          }
        }
        if (member.questionToken) {
          result.canBeUndefined = true
        }
      }
      if (description) {
        result.description = description
      }
      if (deprecated) {
        result.deprecated = deprecated
      }

      properties.push(result)
    }
    return properties
  }

  private findReference({
    typeName,
    parentName,
    parentType,
  }: {
    typeName: string
    parentName: string
    parentType: ParentType
  }): TypeMetadata | undefined {
    // we don't search references for intersection nodes,
    // because intersected parts will result into a single new object
    if (parentType === "intersection") return undefined

    // find if referenced type was pre-registered in the context
    // we create references only for types which were defined in models/inputs
    const existType = this.context.typeNames.find((type) => type === typeName)
    if (!existType) return undefined

    // we also check how deep we are before we create a reference
    // because for the top-level type definitions, e.g. User in { models: { User: ... } }
    // we can't create a references, otherwise we'll have only references and no real objects
    const deepnessCheck = ParserUtils.checkPathDeepness(parentName, {
      regular: this.replaceReferencesOnParentDeepnessLevel,
      args: 1,
    })
    if (!deepnessCheck) return undefined

    // everything is fine, create a reference to a type name
    return TypeMetadataUtils.create("reference", {
      typeName: typeName,
      propertyPath: parentName,
    })
  }

  private normalizeTextSymbol(symbol: string): string {
    if (symbol.substr(0, 1) === `"`) {
      symbol = symbol.substr(1)
    }
    if (symbol.substr(-1) === `"`) {
      symbol = symbol.substr(0, symbol.length - 1)
    }
    return symbol
  }
}

type ParentType =
  | "function"
  | "literal"
  | "intersection"
  | "enum"
  | "class"
  | "interface"
  | "union"
