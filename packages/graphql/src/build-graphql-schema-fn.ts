import { TypeMetadata } from "@microframework/core"
import type {
  GraphQLEnumType,
  GraphQLEnumValueConfigMap,
  GraphQLFieldConfigMap,
  GraphQLInputFieldConfigMap,
  GraphQLInputObjectType,
  GraphQLObjectType,
  GraphQLUnionType,
} from "graphql"
import { GraphQLDate, GraphQLDateTime, GraphQLTime } from "graphql-scalars"
import { GraphQLSchemaBuilderOptions } from "./build-graphql-schema-fn-options"
import type { GraphQLSchemaConfig } from "graphql/type/schema"

/**
 * Builds a GraphQL schema for a provided application metadata.
 */
export function buildGraphQLSchema(
  options: GraphQLSchemaBuilderOptions,
): GraphQLSchemaConfig {
  const graphql = options.graphql
  /**
   * GraphQL type for a BitInt scalar type.
   */
  const GraphQLBigInt = new graphql.GraphQLScalarType({
    name: "BigInt",
    description:
      "BigInt is a built-in object that provides a way to represent whole numbers larger than 253 - 1.",
    serialize: (value) => BigInt(value),
    parseValue: (value) => BigInt(value),
    parseLiteral(ast) {
      if (
        ast.kind === graphql.Kind.INT ||
        ast.kind === graphql.Kind.FLOAT ||
        ast.kind === graphql.Kind.STRING
      ) {
        return BigInt(ast.value)
      }
      return null
    },
  })

  // -- local properties --
  const objectTypes: GraphQLObjectType[] = []
  const inputTypes: GraphQLInputObjectType[] = []
  const enumTypes: GraphQLEnumType[] = []
  const unionTypes: GraphQLUnionType[] = []

  // -- local functions --

  /**
   * Resolves a final GraphQL input / object / union / enum type for a given type metadata.
   */
  function resolveGraphQLType(
    mode: "input" | "object",
    type: TypeMetadata,
  ): any {
    let typeName = type.typeName

    // check if we already have a type with such name
    // if (metadata.kind === "reference") {
    // const existType = objectTypes.find((type) => type.name === typeName)
    // if (existType) return existType
    // }

    if (!type.nullable && !type.canBeUndefined) {
      const subConverted = resolveGraphQLType(mode, {
        ...type,
        nullable: true,
      })
      return graphql.GraphQLNonNull(subConverted)
    } else if (type.array) {
      const subConverted = resolveGraphQLType(mode, {
        ...type,
        array: false,
      })
      return graphql.GraphQLList(subConverted)
    }

    if (mode === "object") {
      if (type.kind === "object" || type.kind === "reference") {
        if (!typeName) {
          typeName = options.namingStrategy.modelTypeName(type)
        }
        const existType = objectTypes.find((type) => type.name === typeName)
        if (existType) {
          return existType
        }
      }
      if (type.kind === "enum" || type.kind === "reference") {
        if (!typeName) {
          typeName = options.namingStrategy.enumTypeName(type)
        }
        const existType = enumTypes.find((type) => type.name === typeName)
        if (existType) {
          return existType
        }
      }
      if (type.kind === "union" || type.kind === "reference") {
        if (!typeName) {
          typeName = options.namingStrategy.unionTypeName(type)
        }
        const existType = unionTypes.find((type) => type.name === typeName)
        if (existType) {
          return existType
        }
      }
    } else if (mode === "input") {
      if (type.kind === "object" || type.kind === "reference") {
        if (!typeName) {
          typeName = options.namingStrategy.inputTypeName(type)
        }
        const existType = inputTypes.find((type) => type.name === typeName)
        if (existType) {
          return existType
        }
      }

      if (type.kind === "enum" || type.kind === "reference") {
        if (!typeName) {
          typeName = options.namingStrategy.enumTypeName(type)
        }
        const existType = enumTypes.find((type) => type.name === typeName)
        if (existType) {
          return existType
        }
      }
    }

    if (type.kind === "boolean") {
      return graphql.GraphQLBoolean
    } else if (type.kind === "string") {
      return graphql.GraphQLString
    } else if (type.kind === "number") {
      return graphql.GraphQLInt
    } else if (type.kind === "bigint") {
      return GraphQLBigInt
    } else if (type.typeName === "BigInt") {
      return GraphQLBigInt
    } else if (type.typeName === "Float") {
      return graphql.GraphQLFloat
    } else if (type.typeName === "Date") {
      return GraphQLDate
    } else if (type.typeName === "Time") {
      return GraphQLTime
    } else if (type.typeName === "DateTime") {
      return GraphQLDateTime
    } else if (type.kind === "enum") {
      return createGraphQLEnumType(type)
    } else if (type.kind === "union") {
      return createGraphQLUnionType(type)
    } else {
      if (mode === "input") {
        return createGraphQLInputType(type)
      } else {
        return createGraphQLObjectType(type)
      }
    }
  }

  /**
   * Creates GraphQLInputObjectType for a given type metadata.
   * If such type was already created, it returns its instance.
   */
  function createGraphQLInputType(
    metadata: TypeMetadata,
  ): GraphQLInputObjectType {
    let typeName = metadata.typeName
    if (!typeName) {
      typeName = options.namingStrategy.inputTypeName(metadata)
    }

    // check if we already have a type with such name
    // if (metadata.kind === "reference") {
    // const existType = inputTypes.find((type) => type.name === typeName)
    // if (existType) return existType
    // }

    // console.log("typeName", typeName, metadata)

    // create a new type and return it back
    const newType = new graphql.GraphQLInputObjectType({
      name: typeName, // metadata.typeName || options.namingStrategy.namelessInput(),
      description: metadata.description,
      fields: () => {
        const fields: GraphQLInputFieldConfigMap = {}
        for (const property of metadata.properties) {
          if (!property.propertyName) continue

          let deprecationReason = undefined
          if (typeof property.deprecated === "string") {
            deprecationReason = property.deprecated
          } else if (property.deprecated === true) {
            deprecationReason = " "
          }

          fields[property.propertyName] = {
            type: resolveGraphQLType("input", property),
            description: property.description,
            deprecationReason,
          }
        }
        return fields
      },
    })
    // console.log(newType.getFields())
    inputTypes.push(newType)
    return newType
  }

  /**
   * Creates a GraphQLEnumType for a given type metadata.
   * If such type was already created, it returns its instance.
   */
  function createGraphQLEnumType(metadata: TypeMetadata): GraphQLEnumType {
    let typeName = metadata.typeName
    if (!typeName) {
      typeName = options.namingStrategy.enumTypeName(metadata)
    }

    // check if we already have a type with such name
    // if (metadata.kind === "reference") {
    // const existType = enumTypes.find((type) => type.name === typeName)
    // if (existType) return existType
    // }
    // console.log("CREATING A NEW ENUM TYPE", typeName)

    // if we don't have such enum yet, create a new one
    // start with creating type fields
    const values: GraphQLEnumValueConfigMap = {}
    for (const property of metadata.properties) {
      if (!property.propertyName) continue
      values[property.propertyName] = {
        description: property.description,
        value: property.propertyName,
        deprecationReason:
          typeof property.deprecated === "string"
            ? property.deprecated
            : property.deprecated === true
            ? ""
            : undefined,
      }
    }

    // if (!metadata.typeName)
    //   throw new Error("Metadata doesn't have a name, cannot create enum")

    // create a new type and return it back
    const newEnum = new graphql.GraphQLEnumType({
      name: typeName,
      description: metadata.description,
      values: values,
    })

    enumTypes.push(newEnum)
    return newEnum
  }

  /**
   * Creates GraphQLUnionType for the given type metadata.
   * If such type was already created, it returns its instance.
   */
  function createGraphQLUnionType(metadata: TypeMetadata): GraphQLUnionType {
    let typeName = metadata.typeName
    if (!typeName) {
      typeName = options.namingStrategy.unionTypeName(metadata)
    }

    // check if we already have a type with such name
    // if (metadata.kind === "reference") {
    //   const existType = unionTypes.find((type) => type.name === typeName)
    //   if (existType) return existType
    // }

    // create a new type and return it back
    const newUnion = new graphql.GraphQLUnionType({
      name: typeName,
      description: metadata.description,
      types: () => {
        return metadata.properties.reduce((types, property) => {
          const type = objectTypes.find(
            (type) => type.name === property.typeName,
          )
          if (type) {
            return [...types, type]
          }
          const unionType = unionTypes.find(
            (type) => type.name === property.typeName,
          )
          if (unionType) {
            return [...types, ...unionType.getTypes()]
          }

          throw new Error(
            `Cannot find type "${property.typeName}" from union type. Did you forget to register type in the app?`,
          )
        }, [] as GraphQLObjectType[])
      },
      // resolveType: (obj) => {
      //     console.log(obj)
      //     return ""
      // }
      // todo: later we need to add __typename support into TypeORM core
    })

    unionTypes.push(newUnion)
    return newUnion
  }

  /**
   * Creates GraphQLObjectType for the given type metadata.
   * If such type was already created, it returns its instance.
   */
  function createGraphQLObjectType(metadata: TypeMetadata): GraphQLObjectType {
    let typeName = metadata.typeName
    if (!typeName) {
      typeName = options.namingStrategy.modelTypeName(metadata)
    }

    // check if we already have a type with such name
    // if (metadata.kind === "reference") {
    // const existType = objectTypes.find((type) => type.name === typeName)
    // if (existType) return existType
    // }

    // create a new type and return it back
    const newType = new graphql.GraphQLObjectType({
      name: typeName,
      description: metadata.description,
      fields: () => {
        const fields: GraphQLFieldConfigMap<any, any> = {}
        for (const property of metadata.properties) {
          if (!property.propertyName) continue

          let deprecationReason = undefined
          if (typeof property.deprecated === "string") {
            deprecationReason = property.deprecated
          } else if (property.deprecated === true) {
            deprecationReason = " "
          }

          fields[property.propertyName] = {
            type: resolveGraphQLType("object", property),
            description: property.description,
            deprecationReason: deprecationReason,
            resolve: options.resolveFactory("model", property, typeName!!),
          }
          if (property.args.length) {
            const argsInput = resolveGraphQLType("input", property.args[0])
            fields[property.propertyName].args = destructGraphQLType(argsInput)
          }
        }
        return fields
      },
    })
    objectTypes.push(newType)
    return newType
  }

  /**
   * Converts a given query, mutation or subscription declaration into GraphQLObjectType.
   */
  function createRootGraphQLObjectType(
    type: "query" | "mutation" | "subscription",
    metadatas: TypeMetadata[],
  ): GraphQLObjectType | undefined {
    if (!metadatas.length) return undefined

    const name = options.namingStrategy.defaultTypeName(type)
    const description = options.namingStrategy.defaultTypeDescription(type)
    const fields: GraphQLFieldConfigMap<any, any> = {}
    for (let metadata of metadatas) {
      if (metadata.kind !== "function") {
        console.log(metadata)
        throw new Error(
          `Root declaration can only be a method definition, e.g. users(): User[].`,
        )
      }
      if (!metadata.propertyName)
        throw new Error(`Missing property name in root declaration.`)
      if (!metadata.returnType)
        throw new Error(`Root declaration must have a return type.`)

      fields[metadata.propertyName] = {
        type: resolveGraphQLTypeBasedOnTypeReference(metadata.returnType),
        description: metadata.description,
        resolve: options.resolveFactory(type, metadata),
      }

      if (metadata.args.length) {
        // console.log(JSON.stringify(metadata.args, undefined, 2))
        const inputType = resolveGraphQLType("input", metadata.args[0])
        fields[metadata.propertyName].args = destructGraphQLType(inputType)
      }

      if (type === "subscription") {
        const subscribe = options.subscribeFactory(metadata)
        if (subscribe) {
          // todo: check if really need this if, I think graphql is graceful
          fields[metadata.propertyName].subscribe = subscribe
        }
      }
    }

    return new graphql.GraphQLObjectType({ name, description, fields })
  }

  /**
   * If given value is input or object type - returns it fields.
   * Otherwise just returns a value (we expect it to be a primitive).
   * This method is used to spread input arguments for root declaration arguments.
   */
  function destructGraphQLType(inputType: any): any {
    if (inputType instanceof graphql.GraphQLNonNull) {
      return destructGraphQLType(inputType.ofType)
    } else if (inputType instanceof graphql.GraphQLList) {
      return destructGraphQLType(inputType.ofType)
    } else if (inputType instanceof graphql.GraphQLInputObjectType) {
      return inputType.getFields()
    } else if (inputType instanceof graphql.GraphQLObjectType) {
      return inputType.getFields()
    }

    return inputType
  }

  /**
   * Finds a GraphQL type for given (referenced) type metadata.
   * This is used for the root declarations, because in their signature
   * we mostly can see a type references,
   * and we need to find a real GraphQLObjectType for these references.
   */
  function resolveGraphQLTypeBasedOnTypeReference(metadata: TypeMetadata) {
    // if (!metadata.typeName && metadata.modelName) {
    //   const metadataModel = options.appMetadata.models.find((model) => {
    //     return model.modelName === metadata.modelName
    //   })
    //   if (metadataModel) {
    //     return resolveGraphQLType("object", {
    //       ...metadata,
    //       typeName: metadataModel.typeName,
    //     })
    //   }
    // }
    if (metadata.typeName) {
      const metadataModel = options.appMetadata.models.find(
        (model) => model.typeName === metadata.typeName,
      )
      if (metadataModel) {
        // console.log("found in model")
        return resolveGraphQLType("object", {
          ...metadata,
          kind: metadataModel.kind,
        })
      } else if (
        metadata.typeName === "Float" ||
        metadata.typeName === "BigInt" ||
        metadata.typeName === "Date" ||
        metadata.typeName === "Time" ||
        metadata.typeName === "DateTime"
      ) {
        return resolveGraphQLType("object", metadata)
      }
    } else {
      return resolveGraphQLType("object", metadata)
    }

    throw new Error(
      `Cannot resolve GraphQL type for ${JSON.stringify(metadata)}`,
    )
  }

  // -- returned type --

  for (let model of options.appMetadata.models) {
    resolveGraphQLType("object", model)
  }

  for (let input of options.appMetadata.inputs) {
    resolveGraphQLType("input", input)
  }

  // console.log([...objectTypes, ...inputTypes, ...enumTypes, ...unionTypes])
  // console.log(JSON.stringify(options.appMetadata, undefined, 2))
  // console.log(options.appMetadata.queries)

  return {
    types: [...objectTypes, ...inputTypes, ...enumTypes, ...unionTypes],
    query: createRootGraphQLObjectType("query", options.appMetadata.queries),
    mutation: createRootGraphQLObjectType(
      "mutation",
      options.appMetadata.mutations,
    ),
    subscription: createRootGraphQLObjectType(
      "subscription",
      options.appMetadata.subscriptions,
    ),
  }
}
