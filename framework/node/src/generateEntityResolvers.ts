import {
  AnyApplication,
  DeclarationMetadata,
  MetadataUtils,
  TypeMetadata,
} from "@microframework/core";
import {Resolver} from "@microframework/core";
import {EntityMetadata} from "typeorm";

/**
 * Transforms entities defined in the app to TypeORM entity format.
 * Should be used to pass app entities to TypeORM connection object.
 */
export function generateEntityResolvers(app: AnyApplication) {
  const queryResolverSchema: Resolver[] = [] // ModelResolverSchema<any, any> = {}
  const mutationResolverSchema: Resolver[] = []
  const queryDeclarations: DeclarationMetadata[] = []
  const mutationDeclarations: DeclarationMetadata[] = []

  // if db connection was established - auto-generate endpoints for models
  if (app.properties.dataSource && app.properties.generateModelRootQueries === true) {
    for (const entity of app.properties.entities) {
      const entityMetadata = app.properties.dataSource.getMetadata(entity.name)

      queryResolverSchema.push(new Resolver({
        type: "query",
        name: app.properties.namingStrategy.generatedModelDeclarations.one(entity.name),
        resolverFn: async (args: any) => {
          args = JSON.parse(JSON.stringify(args)) // temporary fix for args being typeof object but not instanceof Object
          return await app
              .properties
              .dataSource!
              .getRepository(entityMetadata.name)
              .findOne({ where: args.where })
        }
      }))
      queryResolverSchema.push(new Resolver({
        type: "query",
        name: app.properties.namingStrategy.generatedModelDeclarations.oneNotNull(entity.name),
        resolverFn: async (args: any) => {
          args = JSON.parse(JSON.stringify(args)) // temporary fix for args being typeof object but not instanceof Object
          return await app
              .properties
              .dataSource!
              .getRepository(entityMetadata.name)
              .findOne({ where: args.where })
        }
      }))
      queryResolverSchema.push(new Resolver({
        type: "query",
        name: app.properties.namingStrategy.generatedModelDeclarations.many(entity.name),
        resolverFn: async (args: any) => {
          args = JSON.parse(JSON.stringify(args)) // temporary fix for args being typeof object but not instanceof Object
          return await app
              .properties
              .dataSource!
              .getRepository(entityMetadata.name)
              .find({ where: args.where, order: args.order, take: args.limit, skip: args.offset })
        }
      }))

      queryResolverSchema.push(new Resolver({
        type: "query",
        name: app.properties.namingStrategy.generatedModelDeclarations.count(entity.name),
        resolverFn: async (args: any) => {
          args = JSON.parse(JSON.stringify(args)) // temporary fix for args being typeof object but not instanceof Object
          return await app
              .properties
              .dataSource!
              .getRepository(entityMetadata.name)
              .count(args)
        }
      }))

      mutationResolverSchema.push(new Resolver({
        type: "mutation",
        name: app.properties.namingStrategy.generatedModelDeclarations.save(entity.name),
        resolverFn: async (input: any) => {
          return await app
              .properties
              .dataSource!
              .getRepository(entityMetadata.name)
              .save(input)
        }
      }))

      mutationResolverSchema.push(new Resolver({
        type: "mutation",
        name: app.properties.namingStrategy.generatedModelDeclarations.remove(entity.name),
        resolverFn: async (args: any) => {
          await app
              .properties
              .dataSource!
              .getRepository(entityMetadata.name)
              .remove(args)
          return true
        }
      }))

      const model = app.metadata.models.find(model => model.typeName === entity.name) // todo: move method to the model itself
      if (!model)
        throw new Error("Model was not found")

      const whereArgs = createModelFromBlueprint(entityMetadata, model, app, 0)

      const orderArgs: TypeMetadata[] = []
      for (const key in model.properties) {
        const property = model.properties[key]
        if (MetadataUtils.isTypePrimitive(property)) { // todo: yeah make it more complex like with where
          orderArgs.push({
            typeName: "string",
            propertyName: property.propertyName,
            array: false,
            enum: false,
            union: false,
            nullable: true,
            properties: []
          }) // we need to do enum and specify DESC and ASC
        }
      }

      const queryArgs = {
        typeName: "",
        nullable: true,
        array: false,
        enum: false,
        union: false,
        model: false,
        properties: [
          {
            typeName: "",
            propertyName: "where",
            nullable: true,
            array: false,
            enum: false,
            union: false,
            model: false,
            properties: whereArgs
          },
          {
            typeName: "",
            propertyName: "order",
            nullable: true,
            array: false,
            enum: false,
            union: false,
            model: false,
            properties: orderArgs
          },
        ]
      }

      queryDeclarations.push({
        name: app.properties.namingStrategy.generatedModelDeclarations.one(entity.name),
        returnModel: { ...model, nullable: true },
        args: queryArgs
      })
      queryDeclarations.push({
        name: app.properties.namingStrategy.generatedModelDeclarations.oneNotNull(entity.name),
        returnModel: model,
        args: queryArgs
      })
      queryDeclarations.push({
        name: app.properties.namingStrategy.generatedModelDeclarations.many(entity.name),
        returnModel: { ...model, array: true },
        args: queryArgs
      })
      queryDeclarations.push({
        name: app.properties.namingStrategy.generatedModelDeclarations.count(entity.name),
        returnModel: {
          typeName: "number",
          nullable: false,
          enum: false,
          array: false,
          union: false,
          properties: []
        },
        args: {
          typeName: "",
          nullable: true,
          enum: false,
          array: false,
          union: false,
          properties: whereArgs
        }
      })
      mutationDeclarations.push({
        name: app.properties.namingStrategy.generatedModelDeclarations.save(entity.name),
        returnModel: model,
        args: {
          typeName: "",
          nullable: true,
          enum: false,
          array: false,
          union: false,
          properties: whereArgs
        }
      })
      mutationDeclarations.push({
        name: app.properties.namingStrategy.generatedModelDeclarations.remove(entity.name),
        returnModel: {
          typeName: "boolean",
          nullable: false,
          enum: false,
          array: false,
          union: false,
          properties: []
        },
        args: {
          typeName: "",
          nullable: true,
          array: false,
          enum: false,
          union: false,
          properties: whereArgs
        }
      })

      // queryDeclarations[app.properties.namingStrategy.generatedModelDeclarations.oneNotNull(entity.name)] = args(entity.model, {
      //   where: nullable(whereArgs),
      //   order: nullable(orderArgs),
      // })
      // queryDeclarations[app.properties.namingStrategy.generatedModelDeclarations.many(entity.name)] = args(array(entity.model), {
      //   where: nullable(whereArgs),
      //   order: nullable(orderArgs),
      //   offset: nullable(Number),
      //   limit: nullable(Number),
      // })
      // queryDeclarations[app.properties.namingStrategy.generatedModelDeclarations.count(entity.name)] = args({ count: Number }, whereArgs)
      //
      // mutationDeclarations[app.properties.namingStrategy.generatedModelDeclarations.save(entity.name)] = args(entity.model, whereArgs)
      // mutationDeclarations[app.properties.namingStrategy.generatedModelDeclarations.remove(entity.name)] = args({ status: String }, whereArgs)
    }
  }

  // console.log(JSON.stringify(queryDeclarations, undefined, 2));

  return {
    queryResolverSchema,
    mutationResolverSchema,
    queryDeclarations,
    mutationDeclarations,
  }
}


const createModelFromBlueprint = (entityMetadata: EntityMetadata, type: TypeMetadata, app: AnyApplication, deepness: number): TypeMetadata[] => {

  // if (MetadataUtils.isTypePrimitive(type)) {
  //   return { ...type, nullable: true }

    // } else if (TypeCheckers.isModel(type)) {
    //   if (deepness < app.properties.maxGeneratedConditionsDeepness) {
    //     return createModelFromBlueprint(type.blueprint, app, deepness + 1)
    //   }
    //
    // } else if (TypeCheckers.isModelReference(type)) {
    //   if (deepness < app.properties.maxGeneratedConditionsDeepness) {
    //     const modelManager = app.properties.modelManagers.find(manager => manager.name === type.name)
    //     if (!modelManager)
    //       throw new Error(`Cannot find model ${type.name}`)
    //
    //     return createModelFromBlueprint(modelManager.model.blueprint, app, deepness + 1)
    //   }

    // } else if (TypeCheckers.isBlueprintArgs(type)) {
    //   return createModelFromBlueprint(type.valueType, app, deepness)
    //
    // } else if (TypeCheckers.isBlueprintArray(type)) {
    //   return createModelFromBlueprint(type.option, app, deepness)
    //
    // } else if (TypeCheckers.isBlueprintNullable(type)) {
    //   return createModelFromBlueprint(type.option, app, deepness)

    // } else if (TypeCheckers.isBlueprint(type)) {
  // } else {
    const whereArgs: TypeMetadata[] = []
    for (const key in type.properties) {
      const property = type.properties[key]
      if (MetadataUtils.isTypePrimitive(property) /* or enum? */) {
        const columnWithSuchProperty = entityMetadata.findColumnsWithPropertyPath(property.propertyName!)
        if (columnWithSuchProperty) {
          whereArgs.push({
            typeName: property.typeName,
            propertyName: property.propertyName,
            nullable: true,
            enum: false,
            union: false,
            array: false,
            properties: []
          })
        }
      } else {
        const relationWithSuchProperty = entityMetadata.findRelationWithPropertyPath(property.propertyName!)
          if (relationWithSuchProperty && deepness < app.properties.maxGeneratedConditionsDeepness) {
            const reference = app.metadata.models.find(type => type.typeName === property.typeName)
            if (!reference)
              throw new Error(`cannot find a type ${property.typeName}`)

            whereArgs.push({
              typeName: "",
              propertyName: property.propertyName,
              nullable: true,
              enum: false,
              union: false,
              array: false,
              properties: createModelFromBlueprint(relationWithSuchProperty.inverseEntityMetadata, reference, app, deepness + 1)
            })
          }
      }
    }
  // }
  return whereArgs
}
