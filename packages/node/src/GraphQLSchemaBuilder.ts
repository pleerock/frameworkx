import { ApplicationTypeMetadata, TypeMetadata } from "@microframework/core"
import {
  GraphQLBoolean,
  GraphQLEnumType,
  GraphQLEnumValueConfigMap,
  GraphQLFieldConfigMap,
  GraphQLFieldResolver,
  GraphQLFloat,
  GraphQLInputFieldConfigMap,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLUnionType,
} from "graphql"
import { GraphQLDate, GraphQLDateTime, GraphQLTime } from "graphql-iso-date"
import { ApplicationServerProperties } from "./ApplicationServerProperties"
import { LoggerHelper } from "./LoggerHelper"
import { ResolverHelper } from "./ResolverHelper"

/**
 * Builds a GraphQL schema for a provided application metadata.
 */
export class GraphQLSchemaBuilder {
  private appMetadata: ApplicationTypeMetadata
  private properties: ApplicationServerProperties
  private resolverHelper: ResolverHelper
  private objectTypes: GraphQLObjectType[] = []
  private inputTypes: GraphQLInputObjectType[] = []
  private enumTypes: GraphQLEnumType[] = []
  private unionTypes: GraphQLUnionType[] = []

  constructor(
    loggerHelper: LoggerHelper,
    appMetadata: ApplicationTypeMetadata,
    properties: ApplicationServerProperties,
  ) {
    this.appMetadata = appMetadata
    this.properties = properties
    this.resolverHelper = new ResolverHelper(loggerHelper, properties)
  }

  /**
   * Checks if application metadata have queries / mutations / subscriptions to build schema from.
   */
  canHaveSchema() {
    return (
      Object.keys(this.appMetadata.queries).length > 0 ||
      Object.keys(this.appMetadata.mutations).length > 0 ||
      Object.keys(this.appMetadata.subscriptions).length > 0
    )
  }

  /**
   * Builds a complete GraphQL schema based on a given type metadata and resolvers.
   */
  build(): GraphQLSchema {
    for (let model of this.appMetadata.models) {
      // todo: can't we simply call resolveGraphQLType method here?
      if (model.kind === "enum") {
        this.createGraphQLEnumType(model)
      } else if (model.kind === "union") {
        this.createGraphQLUnionType(model)
      } else if (model.kind === "object" || model.kind === "model") {
        this.createGraphQLObjectType(model)
      }
    }

    for (let input of this.appMetadata.inputs) {
      // todo: can't we simply call resolveGraphQLType method here?
      this.createGraphQLInputType(input)
    }

    return new GraphQLSchema({
      types: this.objectTypes,
      query: this.createRootGraphQLObjectType(
        "query",
        this.appMetadata.queries,
      ),
      mutation: this.createRootGraphQLObjectType(
        "mutation",
        this.appMetadata.mutations,
      ),
      subscription: this.createRootGraphQLObjectType(
        "subscription",
        this.appMetadata.subscriptions,
      ),
    })
  }

  /**
   * Resolves a final GraphQL input / object / union / enum type for a given type metadata.
   */
  private resolveGraphQLType(
    mode: "input" | "object",
    type: TypeMetadata,
  ): any {
    if (!type.nullable) {
      const subConverted = this.resolveGraphQLType(mode, {
        ...type,
        nullable: true,
      })
      return GraphQLNonNull(subConverted)
    } else if (type.array) {
      const subConverted = this.resolveGraphQLType(mode, {
        ...type,
        array: false,
      })
      return GraphQLList(subConverted)
    } else if (type.kind === "boolean") {
      return GraphQLBoolean
    } else if (type.kind === "string") {
      return GraphQLString
    } else if (type.kind === "number") {
      return GraphQLInt
    } else if (type.typeName === "Float") {
      return GraphQLFloat
    } else if (type.typeName === "Date") {
      return GraphQLDate
    } else if (type.typeName === "Time") {
      return GraphQLTime
    } else if (type.typeName === "DateTime") {
      return GraphQLDateTime
    } else if (type.kind === "enum") {
      return this.createGraphQLEnumType(type)
    } else if (type.kind === "union") {
      return this.createGraphQLUnionType(type)
    } else {
      if (mode === "input") {
        return this.createGraphQLInputType(type)
      } else {
        return this.createGraphQLObjectType(type)
      }
    }
  }

  /**
   * Creates GraphQLInputObjectType for a given type metadata.
   * If such type was already created, it returns its instance.
   */
  private createGraphQLInputType(
    metadata: TypeMetadata,
  ): GraphQLInputObjectType {
    // check if we already have a type with such name
    const existType = this.inputTypes.find(
      (inputType) => inputType.name === metadata.typeName,
    )
    if (existType) return existType

    // create a new type and return it back
    const newType = new GraphQLInputObjectType({
      name: metadata.typeName || this.properties.namingStrategy.namelessInput(),
      description: metadata.description,
      fields: () => {
        const fields: GraphQLInputFieldConfigMap = {}
        for (const property of metadata.properties) {
          if (!property.propertyName) continue
          fields[property.propertyName] = {
            type: this.resolveGraphQLType("input", property),
            description: property.description,
          }
        }
        return fields
      },
    })
    this.inputTypes.push(newType)
    return newType
  }

  /**
   * Creates a GraphQLEnumType for a given type metadata.
   * If such type was already created, it returns its instance.
   */
  private createGraphQLEnumType(metadata: TypeMetadata): GraphQLEnumType {
    // check if we already have enum with such name
    const existEnum = this.enumTypes.find(
      (type) => type.name === metadata.typeName,
    )
    if (existEnum) return existEnum

    // if we don't have such enum yet, create a new one
    // start with creating type fields
    const values: GraphQLEnumValueConfigMap = {}
    for (const property of metadata.properties) {
      if (!property.propertyName) continue
      values[property.propertyName] = {
        description: property.description,
        value: property.propertyName,
      }
    }

    if (!metadata.typeName)
      throw new Error("Metadata doesn't have a name, cannot create enum")

    // create a new type and return it back
    const newEnum = new GraphQLEnumType({
      name: metadata.typeName,
      description: metadata.description,
      values: values,
    })

    this.enumTypes.push(newEnum)
    return newEnum
  }

  /**
   * Creates GraphQLUnionType for the given type metadata.
   * If such type was already created, it returns its instance.
   */
  private createGraphQLUnionType(metadata: TypeMetadata): GraphQLUnionType {
    // check if we already have union with such name
    const existUnion = this.unionTypes.find(
      (type) => type.name === metadata.typeName,
    )
    if (existUnion) return existUnion

    if (!metadata.typeName)
      throw new Error("Metadata doesn't have a name, cannot create union")

    // create a new type and return it back
    const newUnion = new GraphQLUnionType({
      name: metadata.typeName,
      description: metadata.description,
      types: () => {
        return metadata.properties.map((property) => {
          const type = this.objectTypes.find(
            (type) => type.name === property.typeName,
          )
          if (!type) throw new Error("cannot find type from union type")

          return type
        })
      },
      // resolveType: (obj) => {
      //     console.log(obj)
      //     return ""
      // }
      // todo: later we need to add __typename support into TypeORM core
    })

    this.unionTypes.push(newUnion)
    return newUnion
  }

  /**
   * Creates GraphQLObjectType for the given type metadata.
   * If such type was already created, it returns its instance.
   */
  private createGraphQLObjectType(metadata: TypeMetadata): GraphQLObjectType {
    let typeName = metadata.typeName
    if (!typeName) {
      // console.log(metadata)
      throw new Error("Metadata doesn't have a name, cannot create object")
    }

    // check if we already have a type with such name
    const existType = this.objectTypes.find((type) => type.name === typeName)
    if (existType) return existType

    // create a new type and return it back
    const newType = new GraphQLObjectType({
      name: typeName,
      description: metadata.description,
      fields: () => {
        const fields: GraphQLFieldConfigMap<any, any> = {}
        for (const property of metadata.properties) {
          if (!property.propertyName) continue

          fields[property.propertyName] = {
            type: this.resolveGraphQLType("object", property),
            description: property.description,
            resolve: this.createRootDeclarationResolverFn(
              "model",
              property,
              typeName!!,
            ),
          }
          if (property.args) {
            const argsInput = this.resolveGraphQLType("input", property.args)
            fields[property.propertyName].args = this.destructGraphQLType(
              argsInput,
            )
          }
        }
        return fields
      },
    })
    this.objectTypes.push(newType)
    return newType
  }

  /**
   * Converts a given query, mutation or subscription declaration into GraphQLObjectType.
   */
  private createRootGraphQLObjectType(
    type: "query" | "mutation" | "subscription",
    metadatas: TypeMetadata[],
  ): GraphQLObjectType | undefined {
    if (!metadatas.length) return undefined

    const name = this.properties.namingStrategy.defaultTypeName(type)
    const description = this.properties.namingStrategy.defaultTypeDescription(
      type,
    )
    const fields: GraphQLFieldConfigMap<any, any> = {}
    for (let metadata of metadatas) {
      if (!metadata.propertyName) continue

      fields[metadata.propertyName] = {
        type: this.resolveGraphQLTypeBasedOnTypeReference(metadata),
        description: metadata.description,
        resolve: this.createRootDeclarationResolverFn(type, metadata),
      }

      if (metadata.args) {
        const inputType = this.resolveGraphQLType("input", metadata.args)
        fields[metadata.propertyName].args = this.destructGraphQLType(inputType)
      }

      if (type === "subscription") {
        let subscriptionResolverFn = this.resolverHelper.findSubscriptionResolver(
          metadata.propertyName,
        )

        if (subscriptionResolverFn) {
          fields[
            metadata.propertyName
          ].subscribe = this.resolverHelper.createSubscribeResolver({
            pubSub: this.properties.websocket.pubSub,
            hasArgs: metadata.args !== undefined,
            subscriptionResolverFn,
          })
        }
      }
    }

    return new GraphQLObjectType({ name, description, fields })
  }

  /**
   * If given value is input or object type - returns it fields.
   * Otherwise just returns a value (we expect it to be a primitive).
   * This method is used to spread input arguments for root declaration arguments.
   */
  private destructGraphQLType(inputType: any): any {
    if (inputType instanceof GraphQLNonNull) {
      return this.destructGraphQLType(inputType.ofType)
    } else if (inputType instanceof GraphQLList) {
      return this.destructGraphQLType(inputType.ofType)
    } else if (inputType instanceof GraphQLInputObjectType) {
      return inputType.getFields()
    } else if (inputType instanceof GraphQLObjectType) {
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
  private resolveGraphQLTypeBasedOnTypeReference(metadata: TypeMetadata) {
    if (!metadata.typeName && metadata.modelName) {
      const metadataModel = this.appMetadata.models.find((model) => {
        return model.modelName === metadata.modelName
      })
      if (metadataModel) {
        return this.resolveGraphQLType("object", {
          ...metadata,
          typeName: metadataModel.typeName,
        })
      }
    }
    if (metadata.typeName) {
      const metadataModel = this.appMetadata.models.find(
        (model) => model.typeName === metadata.typeName,
      )
      if (metadataModel) {
        return this.resolveGraphQLType("object", {
          ...metadata,
          kind: metadataModel.kind,
        })
      } else if (
        metadata.typeName === "Float" ||
        metadata.typeName === "Date" ||
        metadata.typeName === "Time" ||
        metadata.typeName === "DateTime"
      ) {
        return this.resolveGraphQLType("object", metadata)
      }
    } else {
      return this.resolveGraphQLType("object", metadata)
    }

    throw new Error(
      `Cannot resolve GraphQL type for ${JSON.stringify(metadata)}`,
    )
  }

  /**
   * Creates a resolver function for a given root declaration.
   */
  private createRootDeclarationResolverFn(
    type: "query" | "mutation" | "subscription" | "model",
    metadata: TypeMetadata,
    parentTypeName?: string,
  ): GraphQLFieldResolver<any, any, any> | undefined {
    if (!metadata.propertyName) throw new Error("No name in metadata")

    // for subscription we just return a dummy resolver
    // (in the future maybe we should use a custom resolver here, based on user demands)
    if (type === "subscription") return (val: any) => val

    // find a user defined resolver function
    const resolverFn = this.resolverHelper.findGraphQLDeclaration(
      type,
      metadata.propertyName,
      parentTypeName,
      metadata.args ? true : false,
    )
    if (resolverFn) {
      return this.resolverHelper.createGraphQLTypeResolver(
        type,
        metadata,
        resolverFn,
        parentTypeName,
      )
    }

    // for model resolvers we have few more options
    if (type === "model" && parentTypeName) {
      // try data-loader resolver if we have registered one
      const dataLoaderResolverFn = this.resolverHelper.findDataLoaderResolver(
        parentTypeName,
        metadata.propertyName,
      )
      if (dataLoaderResolverFn) {
        return this.resolverHelper.createGraphQLTypeDataLoaderResolver(
          metadata,
          dataLoaderResolverFn,
          parentTypeName,
        )
      }

      // try generated relation resolver if we have a data source setup
      if (
        this.properties.dataSource &&
        this.properties.dataSource.hasMetadata(parentTypeName)
      ) {
        const entityRelation = this.properties.dataSource
          .getMetadata(parentTypeName)
          .relations.find(
            (relation) => relation.propertyName === metadata.propertyName!!,
          )
        if (entityRelation) {
          const entityRelationResolverFn = (parents: any[]) => {
            return this.properties
              .dataSource!.relationIdLoader.loadManyToManyRelationIdsAndGroup(
                entityRelation,
                parents,
              )
              .then((groups) => groups.map((group) => group.related))
          }
          return this.resolverHelper.createGraphQLTypeGeneratedRelationResolver(
            metadata,
            entityRelationResolverFn,
            parentTypeName,
          )
        }
      }
    }

    return undefined
  }
}
