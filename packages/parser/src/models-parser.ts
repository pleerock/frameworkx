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

  private appendType(parentName: string, type: TypeMetadata) {
    // return type
    const existType = this.types.find(
      (existType) => existType === type.typeName,
    )
    if (
      ParserUtils.parentDeepness(parentName) >=
        this.replaceReferencesOnParentDeepnessLevel &&
      existType
    ) {
      // console.log("PARENT NAME", parentName)
      return TypeMetadataUtils.create("reference", {
        typeName: existType,
        propertyPath: parentName,
      })
    } else {
      // this.types.push(type)
      return type
    }
  }

  /**
   * If "goDeep" is set to true, parse doesn't go down deeper for object properties.
   * "origin" is used for debug purposes to understand where method call come from.
   */
  parse(node: ts.Node, parentName: string = "", origin: string): TypeMetadata {
    console.log("coming from:", origin)
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
    } else if (ts.isTypeAliasDeclaration(node)) {
      const type = this.parse(
        node.type,
        parentName,
        `${origin}.typeAlias(${node.name.text})`,
      )
      // in type aliases type is declared as:
      // type User = { ... }
      // here, we have everything parsed from { ... }, but we don't really have a type name
      // that's why we append it here
      if (!type.typeName) {
        type.typeName = node.name.text

        // if this is a second-level node, e.g. { models: { User: User } }
        //                                      first level ^     ^ second level
        // we need to check if a first level and second level names matches,
        // for example: { models: { User: UserType } } is invalid signature.
        // in cases where second level is a literal, everything is fine, we accept such case
        // and use a first-level name as a typeName
        if (
          !type.propertyPath &&
          ParserUtils.parentDeepness(parentName) === 1
        ) {
          type.propertyPath = ParserUtils.joinStrings(
            type.propertyPath,
            type.typeName,
          )
        }
      }
      return type
    } else if (ts.isPropertySignature(node)) {
      if (!node.type) {
        throw new Error(`Property signature missing node type`)
      }
      // todo: what is it?
      // console.log("NAME", node.name as any)
      return this.parse(
        node.type,
        ParserUtils.joinStrings(parentName),
        `${origin}.propertySignature(${(node.name as ts.ComputedPropertyName).getText()})`,
      )
    } else if (ts.isParenthesizedTypeNode(node)) {
      return this.parse(node.type, parentName, `${origin}.parenthesized`)
    } else if (ts.isArrayTypeNode(node)) {
      return TypeMetadataUtils.create("object", {
        ...this.parse(node.elementType, parentName, `${origin}.arrayTypeNode`),
        array: true,
      })
    } else if (ts.isTypeLiteralNode(node)) {
      return TypeMetadataUtils.create("object", {
        properties: this.parseMembers(node.members, parentName, origin),
        propertyPath: parentName,
      })
    } else if (ts.isEnumDeclaration(node)) {
      return TypeMetadataUtils.create("enum", {
        properties: this.parseMembers(node.members, parentName, origin),
        propertyPath: parentName,
      })
    } else if (ts.isIntersectionTypeNode(node)) {
      const properties: TypeMetadata[] = []
      node.types.forEach((type) => {
        const parsed = this.parse(
          type,
          ParserUtils.joinStrings(parentName),
          `${origin}.intersectionTypeNode`,
        )
        properties.push(...parsed.properties)
      })

      return TypeMetadataUtils.create("object", {
        properties,
      })
    } else if (ts.isClassDeclaration(node)) {
      if (!node.name) throw Errors.modelClassNoName(parentName)

      const typeName = node.name.text
      let propertyPath = parentName
      if (!propertyPath && ParserUtils.parentDeepness(parentName) === 1) {
        propertyPath = ParserUtils.joinStrings(propertyPath, typeName)
      }

      return this.appendType(
        parentName,
        TypeMetadataUtils.create("object", {
          typeName,
          propertyPath,
          properties: this.parseMembers(node.members, propertyPath, origin),
        }),
      )
    } else if (ts.isInterfaceDeclaration(node)) {
      if (!node.name) throw Errors.modelInterfaceNoName(parentName)

      const typeName = node.name.text
      let propertyPath = parentName
      if (!propertyPath && ParserUtils.parentDeepness(parentName) === 1) {
        propertyPath = ParserUtils.joinStrings(propertyPath, typeName)
      }

      return this.appendType(
        parentName,
        TypeMetadataUtils.create("object", {
          typeName,
          propertyPath,
          properties: this.parseMembers(node.members, propertyPath, origin),
        }),
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
          `${origin}.unionTypeNode`,
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
        )
      }

      const typeName = this.options.namingStrategy?.unionNameFromStringLiteralUnion(
        parentName,
      )
      if (!typeName) throw Errors.emptyGeneratedUnionName(parentName)

      // make sure every type in the union is reference to some other type
      const allAllTypeReferences = typesWithoutNullAndUndefined.every(
        (type) => {
          return ts.isTypeReferenceNode(type)
        },
      )
      if (!allAllTypeReferences)
        throw Errors.unionTypeFormatNotSupported(parentName)

      // finally create a union type for type references
      const properties = typesWithoutNullAndUndefined.map((type) =>
        this.parse(type, parentName, `${origin}.unionTypeNode`),
      )
      return this.appendType(
        parentName,
        TypeMetadataUtils.create("union", {
          typeName,
          nullable,
          canBeUndefined,
          properties,
          propertyPath: parentName,
        }),
      )
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
          origin,
          // goFirstMembersDeep,
        )
        model.description = ParserUtils.getDescription(
          this.typeChecker,
          modelSymbol,
        )
        model.deprecated = ParserUtils.getDeprecation(modelSymbol)
        return this.appendType(parentName, model)
      }

      // extract information out of type reference
      const typeName = node.typeName.text
      // console.log("THIS IS REFERENCE", typeName, node as any)

      // if there is no parent name here, it means this is a root models and inputs
      // and we must create a type out of it, we cannot have a root objects as references
      // example: { models: { User: User } } -> in this example we cannot make User as a reference
      // otherwise we'll never get an object structure of a User object
      // that's why we have a check for parentName here
      const existType = this.types.find((type) => type === typeName)
      if (
        ParserUtils.parentDeepness(parentName) >=
          this.replaceReferencesOnParentDeepnessLevel &&
        existType
      ) {
        // console.log("PARENT NAME", parentName)
        // console.log("origin", origin)
        // console.log("parentName", parentName, parentName.length)
        // console.log("typeName", typeName)
        return TypeMetadataUtils.create("reference", {
          typeName,
          propertyPath: parentName,
        })
      }

      const symbol = referencedType.aliasSymbol || referencedType.symbol

      let resolvedType = undefined
      let description: string = ""
      let deprecated: string | boolean = false
      if (symbol) {
        // console.log(
        //   origin,
        //   // referencedType,
        //   referencedType.aliasSymbol,
        //   referencedType.aliasSymbol!.declarations[0] as any,
        //   referencedType.symbol,
        // )
        resolvedType = symbol.declarations[0]
        description = ParserUtils.getDescription(this.typeChecker, symbol)
        deprecated = ParserUtils.getDeprecation(symbol)
      }

      // if this is a nested call (this case we'll have a parent name) -
      // we don't go deeper to prevent recursion for named symbols
      /*if (
        parentName &&
        !goDeep &&
        (!resolvedType || !ts.isEnumDeclaration(resolvedType))
      ) {
        return TypeMetadataUtils.create("object", {
          typeName,
          description,
          deprecated,
        })
      }*/
      // todo
      // if (!resolvedType || !ts.isEnumDeclaration(resolvedType)) {
      //   // todo: not sure about this check
      //
      //   // typeName or resolvedType ?
      //   const existType = this.types.find((type) => type.typeName === typeName)
      //   if (existType) {
      //     return TypeMetadataUtils.create("object", {
      //       typeName,
      //       // description,
      //       // deprecated,
      //     })
      //   }
      // }

      //
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
        // console.log(referencedType)
        throw Errors.cannotResolveTypeReference(typeName, parentName)
      }

      // console.log("RESOLVED TYPE", resolvedType.kind)
      const type = this.parse(
        resolvedType,
        parentName, // ParserUtils.joinStrings(parentName, typeName),
        `${origin}.typeReferenceNode(${node.typeName.getText()})`,
      )
      // console.log(type)

      // in type aliases type is declared as:
      // class User { ... }
      // here, we have everything parsed from { ... }, but we don't really have a type name
      // that's why we append it here
      // if (!type.typeName) {
      type.typeName = typeName
      // }

      // todo: suspicious logic, check if we need it
      if (!type.description) {
        type.description = description
      }
      if (!type.deprecated) {
        type.deprecated = deprecated
      }

      return type

      // return this.appendType({
      //   ...this.parse(
      //     resolvedType,
      //     ParserUtils.joinStrings(parentName, typeName),
      //     // true, // if you want to change it, then revisit how it works because change will lead to bugs
      //     `${origin}.typeReferenceNode(${node.typeName.getText()})`,
      //     // goFirstMembersDeep,
      //   ),
      //   typeName,
      //   description,
      //   deprecated,
      // })
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

      const model = this.parseModel("", "", modelType, argsType, origin)
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
      parentName, // ParserUtils.joinStrings(parentName /*, typeName*/),
      `${origin}.parseModel(${modelName})`,
    )
    model.modelName = modelName

    // create args if model with args
    if (argsType) {
      const argsModel = this.parse(
        argsType,
        ParserUtils.joinStrings(parentName, /*typeName, */ "Args"),
        `${origin}.parseModel(args)(${modelName})`,
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

      // "parseMembers" is called not only for a object literal properties or class properties,
      // but also for an enum, that's why we need this isEnumMember check here.
      if (ts.isEnumMember(member)) {
        if (!member.initializer) {
          throw Errors.enumPropertyInvalid(parentName, propertyName)
        }

        const initializerName = member.initializer.getText().trim()
        const value = ParserUtils.normalizeTextSymbol(initializerName)
        if (propertyName !== value) {
          throw Errors.enumPropertyMustMatchValue(parentName, propertyName)
        }

        // todo: why parse method doesn't do it?
        properties.push(
          TypeMetadataUtils.create("object", {
            propertyName,
            description,
            deprecated,
            propertyPath: ParserUtils.joinStrings(parentName, propertyName),
          }),
        )
      } else {
        if (!member.type)
          throw Errors.methodNoReturningType(parentName, propertyName)

        // console.log("checking parentName", parentName)
        // console.log(`[LOG] parsing member(${member.type.kind})`)
        // console.log("member.initializer", member.type)
        const result: TypeMetadata = {
          ...this.parse(
            member.type,
            ParserUtils.joinStrings(parentName, propertyName),
            `${origin}.parseMembers(${member.name.getText()})`,
          ),
          propertyName,
        }
        // console.log("RESULT", result)

        // if property is a method, we also parse its arguments
        // todo: what if property is a function?
        if (ts.isMethodSignature(member)) {
          result.args = member.parameters.map((parameter) => {
            if (!ts.isParameter(parameter) || !parameter.type)
              throw new Error(`Method parameter ${propertyName} isn't valid.`)

            return this.parse(
              parameter.type,
              ParserUtils.joinStrings(parentName, propertyName, "Args"),
              `${origin}.parseMembers(${propertyName})`, // todo: maybe use more effective name here like .[]
            )
          })
        }
        if (member.questionToken) {
          result.canBeUndefined = true
        }
        if (description) {
          result.description = description
        }
        if (deprecated) {
          result.deprecated = deprecated
        }
        properties.push(result)
      }
    }
    return properties
  }
}
