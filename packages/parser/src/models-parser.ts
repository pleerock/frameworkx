import { TypeMetadata, TypeMetadataUtils } from "@microframework/core"
import * as ts from "typescript"
import { Errors } from "./errors"
import { ParserOptions } from "./options"
import { ParserUtils } from "./utils"

export class ModelParser {
  private program: ts.Program
  private options: ParserOptions
  private typeChecker: ts.TypeChecker
  private types: string[]
  private replaceReferencesOnParentDeepnessLevel: number

  constructor(
    program: ts.Program,
    options: ParserOptions,
    types: string[],
    replaceReferencesOnParentDeepnessLevel: number,
  ) {
    this.program = program
    this.options = options
    this.types = types
    this.replaceReferencesOnParentDeepnessLevel = replaceReferencesOnParentDeepnessLevel
    this.typeChecker = program.getTypeChecker()
  }

  private appendType(
    parentName: string,
    type: TypeMetadata,
    noReferences: boolean,
  ) {
    if (noReferences) return type

    // return type
    const existType = this.types.find(
      (existType) => existType === type.typeName,
    )
    if (
      ParserUtils.checkPathDeepness(parentName, {
        regular: this.replaceReferencesOnParentDeepnessLevel,
        args: 1,
      }) &&
      existType
    ) {
      // console.log("PARENT NAME", parentName)
      return TypeMetadataUtils.create("reference", {
        typeName: existType,
        propertyPath: ParserUtils.joinStrings(parentName), //, existType),
      })
    } else {
      // this.types.push(type)
      return type
    }
  }

  parse(
    node: ts.Node,
    parentName: string,
    debugPath: string,
    noReferences: boolean,
  ): TypeMetadata {
    // console.log("debug path:", origin)
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
      if (!node.type) {
        throw Errors.propertySignatureInvalid(parentName, debugPath)
      }
      return this.parse(
        node.type,
        ParserUtils.joinStrings(parentName),
        `${debugPath}.propertySignature(${node.name.getText()})`,
        noReferences,
      )
    } else if (ts.isParenthesizedTypeNode(node)) {
      return this.parse(
        node.type,
        parentName,
        `${debugPath}.parenthesized`,
        noReferences,
      )
    } else if (ts.isArrayTypeNode(node)) {
      return {
        ...this.parse(
          node.elementType,
          parentName,
          `${debugPath}.array`,
          noReferences,
        ),
        array: true,
      }
    } else if (ts.isTypeLiteralNode(node)) {
      return TypeMetadataUtils.create("object", {
        properties: this.parseMembers(
          node.members,
          parentName,
          `${debugPath}.literal`,
          false,
        ),
        propertyPath: parentName,
      })
    } else if (ts.isEnumDeclaration(node)) {
      return TypeMetadataUtils.create("enum", {
        properties: this.parseMembers(
          node.members,
          parentName,
          `${debugPath}.enum`,
          false,
        ),
        propertyPath: parentName,
      })
    } else if (ts.isIntersectionTypeNode(node)) {
      const properties: TypeMetadata[] = []
      for (let type of node.types) {
        const parsed = this.parse(
          type,
          parentName,
          `${debugPath}.intersection`,
          true,
        )
        properties.push(...parsed.properties)
      }

      // todo: add error handling if different intersection types are resulted in properties

      return TypeMetadataUtils.create("object", {
        properties,
        propertyPath: parentName,
      })
    } else if (ts.isClassDeclaration(node)) {
      if (!node.name) {
        throw Errors.modelClassNoName(parentName, debugPath)
      }

      let typeName: string | undefined = undefined
      if (this.types.includes(node.name.text)) {
        typeName = node.name.text
      }
      let propertyPath = parentName
      if (
        typeName &&
        !propertyPath &&
        ParserUtils.checkPathDeepness(parentName, {
          regular: 1,
          args: 1,
        })
      ) {
        propertyPath = ParserUtils.joinStrings(propertyPath, typeName)
      }

      return this.appendType(
        parentName,
        TypeMetadataUtils.create("object", {
          typeName,
          propertyPath,
          properties: this.parseMembers(
            node.members,
            propertyPath,
            debugPath,
            false,
          ),
        }),
        noReferences,
      )
    } else if (ts.isInterfaceDeclaration(node)) {
      if (!node.name) throw Errors.modelInterfaceNoName(parentName)

      let typeName: string | undefined = undefined
      if (this.types.includes(node.name.text)) {
        typeName = node.name.text
      }
      let propertyPath = parentName
      if (
        typeName &&
        !propertyPath &&
        ParserUtils.checkPathDeepness(parentName, {
          regular: 1,
          args: 1,
        })
      ) {
        propertyPath = ParserUtils.joinStrings(propertyPath, typeName)
      }

      return this.appendType(
        parentName,
        TypeMetadataUtils.create("object", {
          typeName,
          propertyPath,
          properties: this.parseMembers(
            node.members,
            propertyPath,
            debugPath,
            false,
          ),
        }),
        noReferences,
      )
    } else if (ts.isEnumMember(node)) {
      if (!node.initializer) {
        throw Errors.enumPropertyInvalid(parentName, "")
      }

      const initializerName = node.initializer.getText().trim()
      const propertyName = ParserUtils.normalizeTextSymbol(initializerName)

      return this.appendType(
        parentName,
        TypeMetadataUtils.create("object", {
          propertyName,
          // description,
          // deprecated,
          propertyPath: ParserUtils.joinStrings(parentName, propertyName),
        }),

        noReferences,
      )
    } else if (ts.isUnionTypeNode(node)) {
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
        throw Errors.unionTypeDoesNotContainTypes(parentName)
      }

      // this means union type isn't real union type - its just a specific type that is also "undefined" and / or "null"
      // examples: "user: User | null", "photo: Photo | undefined", "counter: number | null | undefined"
      if (typesWithoutNullAndUndefined.length === 1) {
        const metadata = this.parse(
          typesWithoutNullAndUndefined[0],
          parentName,
          `${debugPath}.unionTypeNode`,
          noReferences,
        )
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

      // if union consist of strings - we create enumeration (maaaagic)
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
            throw Errors.invalidStringLiteralValueForEnumName(
              parentName,
              type.literal.text,
            )

          return type.literal.text
        })

        // todo: commented this block for now, since typeName is generated in a new place (check if safe to remove)
        // since we are generating a new enum, we rely on naming strategy to generate its name
        // const typeName = this.options.namingStrategy?.enumNameFromStringLiteralUnion(
        //   parentName,
        // )
        // if (!typeName) {
        //   throw Errors.emptyGeneratedEnumNameFromStringLiterals(
        //     parentName,
        //     literals,
        //   )
        // }

        // create enum properties
        const properties = literals.map((literal) => {
          return TypeMetadataUtils.create("property", {
            propertyName: literal,
            propertyPath: ParserUtils.joinStrings(parentName, literal),
          })
        })

        // console.log("checking for a parentName", parentName, origin)
        return this.appendType(
          parentName,
          TypeMetadataUtils.create("enum", {
            // typeName,
            nullable,
            canBeUndefined,
            properties,
            propertyPath: parentName,
          }),
          false,
        )
      }

      // check if types inside are

      // const typeName = this.options.namingStrategy?.unionNameFromStringLiteralUnion(
      //   parentName,
      // ) // todo: move naming strategy into graphql
      // if (!typeName) throw Errors.emptyGeneratedUnionName(parentName)

      // make sure every type in the union is reference to some other type
      const areAllTypeReferences = typesWithoutNullAndUndefined.every(
        (type) => {
          return ts.isTypeReferenceNode(type)
        },
      )
      if (!areAllTypeReferences)
        throw Errors.unionTypeFormatNotSupported(parentName)

      // console.log("typesWithoutNullAndUndefined", typesWithoutNullAndUndefined)

      // finally create a union type for type references
      const properties = typesWithoutNullAndUndefined.map((type) => {
        return this.parse(type, parentName, `${debugPath}.unionTypeNode`, false)
      })

      // in the case if all properties are "enums", user declared a unioned enums, e.g.
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

        return this.appendType(
          parentName,
          TypeMetadataUtils.create("enum", {
            // typeName,
            nullable,
            canBeUndefined,
            properties: enumPropertiesFromAllEnums,
            propertyPath: parentName,
          }),
          false,
        )
      }

      // also make sure each referenced type is a "model" registered
      const areAllReferencedTypesModels = properties.every((metadata) => {
        return metadata.typeName && this.types.includes(metadata.typeName)
      })
      if (!areAllReferencedTypesModels) {
        // todo: also list names not registered in the error
        throw Errors.unionTypeFormatNotSupported(parentName)
      }

      return this.appendType(
        parentName,
        TypeMetadataUtils.create("union", {
          // typeName,
          nullable,
          canBeUndefined,
          properties,
          propertyPath: parentName,
        }),
        false,
      )
    } else if (ts.isTypeAliasDeclaration(node)) {
      const type = this.parse(
        node.type,
        parentName,
        `${debugPath}.typeAlias(${node.name.text})`,
        noReferences,
      )
      // in type aliases type is declared as: type User = { ... }
      // we have everything parsed from { ... }, but we don't really have a type name
      // that's why we append it here, but only if name was declared in the models / inputs
      if (!type.typeName && this.types.includes(node.name.text)) {
        type.typeName = node.name.text
      }

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
    } else if (ts.isTypeReferenceNode(node)) {
      const referencedType = this.typeChecker.getTypeAtLocation(node)

      if (!ts.isIdentifier(node.typeName) || !node.typeName.text)
        throw Errors.typeReferenceInvalidName(parentName)

      // this is a special handling section for Model definitions
      if (
        referencedType.aliasSymbol &&
        referencedType.aliasSymbol.name === "ModelWithArgs" &&
        referencedType.aliasTypeArguments
      ) {
        // extract model's type and args information
        const modelName = node.typeName.text
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
        // const existType = this.types.find((type) => type === modelName)
        // if (existType) {
        //   return TypeMetadataUtils.create("model", {
        //     modelName,
        //   })
        // }

        const model = this.parseModel(
          parentName,
          modelName,
          modelType,
          argsType,
          debugPath,
          // goFirstMembersDeep,
        )
        model.description = ParserUtils.getDescription(
          this.typeChecker,
          modelSymbol,
        )
        model.deprecated = ParserUtils.getDeprecation(modelSymbol)
        return this.appendType(parentName, model, noReferences)
      }

      // extract information out of type reference
      const typeName = node.typeName.text

      // if there is no parent name here, it means this is a root models and inputs
      // and we must create a type out of it, we cannot have a root objects as references
      // example: { models: { User: User } } -> in this example we cannot make User as a reference
      // otherwise we'll never get an object structure of a User object
      // that's why we have a check for parentName here
      const existType = this.types.find((type) => type === typeName)
      if (
        noReferences === false &&
        ParserUtils.checkPathDeepness(parentName, {
          regular: this.replaceReferencesOnParentDeepnessLevel,
          args: 1,
        }) &&
        existType
      ) {
        return TypeMetadataUtils.create("reference", {
          typeName,
          propertyPath: ParserUtils.joinStrings(parentName), // , typeName),
        })
      }

      const symbol = referencedType.aliasSymbol || referencedType.symbol

      let resolvedType = undefined
      let description: string = ""
      let deprecated: string | boolean = false
      if (symbol) {
        resolvedType = symbol.declarations[0]
        description = ParserUtils.getDescription(this.typeChecker, symbol)
        deprecated = ParserUtils.getDeprecation(symbol)
      }

      // check if it's a reference to a default scalars we have
      if (
        typeName === "Float" ||
        typeName === "BigInt" ||
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

      const type = this.parse(
        resolvedType,
        parentName,
        `${debugPath}.typeReferenceNode(${node.typeName.getText()})`,
        noReferences,
      )

      // in type aliases type is declared as:
      // class User { ... }
      // here, we have everything parsed from { ... }, but we don't really have a type name
      // that's why we append it here
      if (this.types.includes(typeName)) {
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
      const modelSymbol = this.typeChecker.getTypeAtLocation(
        node.typeArguments[0],
      )
      if (modelSymbol.symbol) {
        modelType = modelSymbol.symbol.declarations[0]
      }
      if (!modelType) throw Errors.importedNodeModelInvalid(parentName)

      // find args
      let argsType: ts.Node | undefined = undefined
      if (node.typeArguments[1]) {
        const symbol = this.typeChecker.getTypeAtLocation(node.typeArguments[1])
        if (symbol.aliasSymbol) {
          argsType = symbol.aliasSymbol.declarations[0]
        }
      }

      const model = this.parseModel("", "", modelType, argsType, debugPath)
      model.description = ParserUtils.getDescription(
        this.typeChecker,
        modelSymbol.symbol,
      )
      model.deprecated = ParserUtils.getDeprecation(modelSymbol.symbol)
      return model // todo: weirdness
    }

    throw Errors.signatureNotSupported(node)
  }

  private parseModel(
    parentName: string,
    modelName: string,
    modelType: ts.Node,
    argsType: ts.Node | undefined,
    origin: string,
  ) {
    // create a model with a type
    const model = this.parse(
      modelType,
      parentName,
      `${origin}.parseModel(${modelName})`,
      false,
    )
    model.modelName = modelName

    // create args if model with args
    if (argsType) {
      const argsModel = this.parse(
        argsType,
        ParserUtils.joinStrings(parentName, /*typeName, */ "Args"),
        `${origin}.parseModel(args)(${modelName})`,
        false, // true?
      )
      // console.log(parentName)
      // console.log("!", model.typeName + ".Args", argsModel)

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

  private parseMembers(
    members: ts.NodeArray<ts.Node>,
    parentName: string,
    origin: string,
    noReferences: boolean,
  ): TypeMetadata[] {
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
      const propertyName = ParserUtils.normalizeTextSymbol(rawMemberName)
      const description = ParserUtils.getDescription(this.typeChecker, member)
      const deprecated = ParserUtils.getDeprecation(member)
      let result: TypeMetadata | undefined = undefined

      // "parseMembers" is called not only for a object literal properties or class properties,
      // but also for an enum, that's why we need this isEnumMember check here.
      if (ts.isEnumMember(member)) {
        const parsed = this.parse(member, parentName, origin, noReferences)
        if (propertyName !== parsed.propertyName) {
          throw Errors.enumPropertyMustMatchValue(parentName, propertyName)
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
            returnType: this.parse(
              member.type,
              ParserUtils.joinStrings(parentName, propertyName, "Return"),
              `${origin}.parseMembers(${propertyName})(Return)`,
              noReferences,
            ),
            args: member.parameters.map((parameter) => {
              if (!ts.isParameter(parameter) || !parameter.type)
                throw new Error(`Method parameter ${propertyName} isn't valid.`)

              return this.parse(
                parameter.type,
                ParserUtils.joinStrings(parentName, propertyName, "Args"),
                `${origin}.parseMembers(${propertyName})(Args)`,
                false,
              )
            }),
          })
        } else {
          // otherwise it's just a property, e.g. { id: number }
          result = {
            ...this.parse(
              member.type,
              ParserUtils.joinStrings(parentName, propertyName),
              `${origin}.parseMembers(${propertyName})`,
              noReferences,
            ),
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
}
