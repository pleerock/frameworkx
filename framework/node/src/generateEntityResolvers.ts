import {
  AnyApplication,
  MetadataUtils,
  TypeMetadata,
} from "@microframework/core";
import {ResolverMetadata} from "@microframework/core";
import {isModel} from "@microframework/model";
import {EntityMetadata, InsertEvent} from "typeorm";

/**
 * Transforms entities defined in the app to TypeORM entity format.
 * Should be used to pass app entities to TypeORM connection object.
 */
export function generateEntityResolvers(app: AnyApplication) {
  const queryResolverSchema: ResolverMetadata[] = [] // ModelResolverSchema<any, any> = {}
  const mutationResolverSchema: ResolverMetadata[] = []
  const subscriptionResolverSchema: ResolverMetadata[] = []
  const queryDeclarations: TypeMetadata[] = []
  const mutationDeclarations: TypeMetadata[] = []
  const subscriptionDeclarations: TypeMetadata[] = []

  // if db connection was established - auto-generate endpoints for models
  if (app.properties.dataSource && app.properties.generateModelRootQueries === true) {
    for (const entity of app.properties.entities) {
      const modelName = isModel(entity.name) ? entity.name.name : entity.name
      const entityMetadata = app.properties.dataSource.getMetadata(modelName)

      queryResolverSchema.push({
        instanceof: "Resolver",
        type: "declaration-item-resolver",
        declarationType: "query",
        name: app.properties.namingStrategy.generatedModelDeclarations.one(modelName),
        resolverFn: async (args: any) => {
          args = JSON.parse(JSON.stringify(args)) // temporary fix for args being typeof object but not instanceof Object
          return await app
              .properties
              .dataSource!
              .getRepository(entityMetadata.name)
              .findOne({ where: args.where })
        }
      })
      queryResolverSchema.push({
        instanceof: "Resolver",
        type: "declaration-item-resolver",
        declarationType: "query",
        name: app.properties.namingStrategy.generatedModelDeclarations.oneNotNull(modelName),
        resolverFn: async (args: any) => {
          args = JSON.parse(JSON.stringify(args)) // temporary fix for args being typeof object but not instanceof Object
          return await app
              .properties
              .dataSource!
              .getRepository(entityMetadata.name)
              .findOne({ where: args.where })
        }
      })
      queryResolverSchema.push({
        instanceof: "Resolver",
        type: "declaration-item-resolver",
        declarationType: "query",
        name: app.properties.namingStrategy.generatedModelDeclarations.many(modelName),
        resolverFn: async (args: any) => {
          args = JSON.parse(JSON.stringify(args)) // temporary fix for args being typeof object but not instanceof Object
          return await app
              .properties
              .dataSource!
              .getRepository(entityMetadata.name)
              .find({ where: args.where, order: args.order, take: args.limit, skip: args.offset })
        }
      })

      queryResolverSchema.push({
        instanceof: "Resolver",
        type: "declaration-item-resolver",
        declarationType: "query",
        name: app.properties.namingStrategy.generatedModelDeclarations.count(modelName),
        resolverFn: async (args: any) => {
          args = JSON.parse(JSON.stringify(args)) // temporary fix for args being typeof object but not instanceof Object
          return await app
              .properties
              .dataSource!
              .getRepository(entityMetadata.name)
              .count(args)
        }
      })

      mutationResolverSchema.push({
        instanceof: "Resolver",
        type: "declaration-item-resolver",
        declarationType: "mutation",
        name: app.properties.namingStrategy.generatedModelDeclarations.save(modelName),
        resolverFn: async (input: any) => {
          return await app
              .properties
              .dataSource!
              .getRepository(entityMetadata.name)
              .save(input)
        }
      })

      mutationResolverSchema.push({
        instanceof: "Resolver",
        type: "declaration-item-resolver",
        declarationType: "mutation",
        name: app.properties.namingStrategy.generatedModelDeclarations.remove(modelName),
        resolverFn: async (args: any) => {
          await app
              .properties
              .dataSource!
              .getRepository(entityMetadata.name)
              .remove(args)
          return true
        }
      })

      const manyTriggerName = app.properties.namingStrategy.generatedModelDeclarations.observeManyTriggerName(entityMetadata.name)
      const oneTriggerName = app.properties.namingStrategy.generatedModelDeclarations.observeOneTriggerName(entityMetadata.name)
      const countTriggerName = app.properties.namingStrategy.generatedModelDeclarations.observeCountTriggerName(entityMetadata.name)
      const insertTriggerName = app.properties.namingStrategy.generatedModelDeclarations.observeInsertTriggerName(entityMetadata.name)
      const saveTriggerName = app.properties.namingStrategy.generatedModelDeclarations.observeSaveTriggerName(entityMetadata.name)
      const updateTriggerName = app.properties.namingStrategy.generatedModelDeclarations.observeInsertTriggerName(entityMetadata.name)
      const removeTriggerName = app.properties.namingStrategy.generatedModelDeclarations.observeRemoveTriggerName(entityMetadata.name)

      app
          .properties
          .dataSource!
          .subscribers
          .push({
            listenTo: () => {
              return entityMetadata.target;
            },
            afterInsert: (event: InsertEvent<any>) => {
              app.properties.pubsub.publish(insertTriggerName, event.entity)
              app.properties.pubsub.publish(saveTriggerName, event.entity)
            },
            afterUpdate: event => {
              app.properties.pubsub.publish(updateTriggerName, event.entity)
              app.properties.pubsub.publish(saveTriggerName, event.entity)
            },
            afterRemove: event => {
              app.properties.pubsub.publish(removeTriggerName, event.entity)
            }
          })

      subscriptionResolverSchema.push({
        instanceof: "Resolver",
        type: "declaration-item-resolver",
        declarationType: "subscription",
        name: app.properties.namingStrategy.generatedModelDeclarations.observeInsert(modelName),
        resolverFn: {
          triggers: [insertTriggerName]
        }
      })
      subscriptionResolverSchema.push({
        instanceof: "Resolver",
        type: "declaration-item-resolver",
        declarationType: "subscription",
        name: app.properties.namingStrategy.generatedModelDeclarations.observeUpdate(modelName),
        resolverFn: {
          triggers: [updateTriggerName]
        }
      })
      subscriptionResolverSchema.push({
        instanceof: "Resolver",
        type: "declaration-item-resolver",
        declarationType: "subscription",
        name: app.properties.namingStrategy.generatedModelDeclarations.observeSave(modelName),
        resolverFn: {
          triggers: [saveTriggerName]
        }
      })
      subscriptionResolverSchema.push({
        instanceof: "Resolver",
        type: "declaration-item-resolver",
        declarationType: "subscription",
        name: app.properties.namingStrategy.generatedModelDeclarations.observeRemove(modelName),
        resolverFn: {
          triggers: [removeTriggerName]
        }
      })

      subscriptionResolverSchema.push({
        instanceof: "Resolver",
        type: "declaration-item-resolver",
        declarationType: "subscription",
        name: app.properties.namingStrategy.generatedModelDeclarations.observeOne(modelName),
        resolverFn: {
          triggers: [oneTriggerName],
          onSubscribe: (args: any, context: any) => {
            // console.log("subscribed", args)
            context.observeOneEntitySubscription = app
                .properties
                .dataSource!
                .manager
                .getRepository(entityMetadata.name)
                .observeOne(args)
                .subscribe(entity => {
                  // console.log("trigger", oneTriggerName)
                  args = JSON.parse(JSON.stringify(args)) // temporary fix for args being typeof object but not instanceof Object
                  app.properties.pubsub.publish(oneTriggerName, entity)
                })
          },
          onUnsubscribe: (args: any, context: any) => {
            if (context.observeOneEntitySubscription) {
              // console.log("unsubscribed", args)
              context.observeOneEntitySubscription.unsubscribe()
            }
          }
        }
      })
      subscriptionResolverSchema.push({
        instanceof: "Resolver",
        type: "declaration-item-resolver",
        declarationType: "subscription",
        name: app.properties.namingStrategy.generatedModelDeclarations.observeMany(modelName),
        resolverFn: {
          triggers: [manyTriggerName],
          onSubscribe: (args: any, context: any) => {
            // console.log("subscribed", args)
            args = JSON.parse(JSON.stringify(args)) // temporary fix for args being typeof object but not instanceof Object
            context.observeOneEntitySubscription = app
                .properties
                .dataSource!
                .manager
                .getRepository(entityMetadata.name)
                .observe(args)
                .subscribe(entities => {
                  // console.log("trigger", manyTriggerName, entities)
                  app.properties.pubsub.publish(manyTriggerName, entities)
                })
          },
          onUnsubscribe: (args: any, context: any) => {
            if (context.observeOneEntitySubscription) {
              // console.log("unsubscribed", args)
              context.observeOneEntitySubscription.unsubscribe()
            }
          }
        }
      })
      subscriptionResolverSchema.push({
        instanceof: "Resolver",
        type: "declaration-item-resolver",
        declarationType: "subscription",
        name: app.properties.namingStrategy.generatedModelDeclarations.observeCount(modelName),
        resolverFn: {
          triggers: [countTriggerName],
          onSubscribe: (args: any, context: any) => {
            // console.log("subscribed", args)
            args = JSON.parse(JSON.stringify(args)) // temporary fix for args being typeof object but not instanceof Object
            context.observeOneEntitySubscription = app
                .properties
                .dataSource!
                .manager
                .getRepository(entityMetadata.name)
                .observeCount(args)
                .subscribe(entity => {
                  // console.log("trigger", countTriggerName)
                  app.properties.pubsub.publish(countTriggerName, entity)
                })
          },
          onUnsubscribe: (args: any, context: any) => {
            if (context.observeOneEntitySubscription) {
              // console.log("unsubscribed", args)
              context.observeOneEntitySubscription.unsubscribe()
            }
          }
        }
      })

      const model = app.metadata.models.find(model => model.typeName === modelName) // todo: move method to the model itself
      if (!model)
        throw new Error("Model was not found")

      const whereArgsProperties = createModelFromBlueprint(entityMetadata, model, app, 0)

      const orderArgsProperties: TypeMetadata[] = []
      for (const key in model.properties) {
        const property = model.properties[key]
        if (MetadataUtils.isTypePrimitive(property)) { // todo: yeah make it more complex like with where
          orderArgsProperties.push(MetadataUtils.createType("string", {
            propertyName: property.propertyName,
            nullable: true,
          })) // we need to do enum and specify DESC and ASC
        }
      }

      const whereArgs = MetadataUtils.createType("object", {
        typeName: app.properties.namingStrategy.generatedModelInputs.where(model.typeName!!),
        propertyName: "where",
        nullable: true,
        properties: whereArgsProperties,
      })

      const orderByArgs = MetadataUtils.createType("object", {
        typeName: app.properties.namingStrategy.generatedModelInputs.order(model.typeName!!),
        propertyName: "order",
        nullable: true,
        properties: orderArgsProperties,
      })

      const queryArgs = MetadataUtils.createType("object", {
        nullable: true,
        properties: [whereArgs, orderByArgs]
      })

      queryDeclarations.push({
        ...model,
        nullable: true,
        propertyName: app.properties.namingStrategy.generatedModelDeclarations.one(modelName),
        description: app.properties.namingStrategy.generatedModelDeclarationDescriptions.one(modelName),
        args: queryArgs
      })
      queryDeclarations.push({
        ...model,
        nullable: false,
        propertyName: app.properties.namingStrategy.generatedModelDeclarations.oneNotNull(modelName),
        description: app.properties.namingStrategy.generatedModelDeclarationDescriptions.oneNotNull(modelName),
        args: queryArgs
      })
      queryDeclarations.push({
        ...model,
        array: true,
        propertyName: app.properties.namingStrategy.generatedModelDeclarations.many(modelName),
        description: app.properties.namingStrategy.generatedModelDeclarationDescriptions.many(modelName),
        args: queryArgs
      })
      queryDeclarations.push({
        ...MetadataUtils.createType("number"),
        propertyName: app.properties.namingStrategy.generatedModelDeclarations.count(modelName),
        description: app.properties.namingStrategy.generatedModelDeclarationDescriptions.count(modelName),
        args: whereArgs,
      })
      mutationDeclarations.push({
        ...model,
        propertyName: app.properties.namingStrategy.generatedModelDeclarations.save(modelName),
        description: app.properties.namingStrategy.generatedModelDeclarationDescriptions.save(modelName),
        args: whereArgs,
      })
      mutationDeclarations.push({
        ...MetadataUtils.createType("boolean"),
        propertyName: app.properties.namingStrategy.generatedModelDeclarations.remove(modelName),
        description: app.properties.namingStrategy.generatedModelDeclarationDescriptions.remove(modelName),
        args: whereArgs,
      })
      subscriptionDeclarations.push({
        ...model,
        propertyName: app.properties.namingStrategy.generatedModelDeclarations.observeInsert(modelName),
        description: app.properties.namingStrategy.generatedModelDeclarationDescriptions.observeInsert(modelName),
        // args: whereArgs,
      })
      subscriptionDeclarations.push({
        ...model,
        propertyName: app.properties.namingStrategy.generatedModelDeclarations.observeUpdate(modelName),
        description: app.properties.namingStrategy.generatedModelDeclarationDescriptions.observeUpdate(modelName),
        // args: whereArgs,
      })
      subscriptionDeclarations.push({
        ...model,
        propertyName: app.properties.namingStrategy.generatedModelDeclarations.observeSave(modelName),
        description: app.properties.namingStrategy.generatedModelDeclarationDescriptions.observeSave(modelName),
        // args: whereArgs,
      })
      subscriptionDeclarations.push({
        ...model,
        propertyName: app.properties.namingStrategy.generatedModelDeclarations.observeRemove(modelName),
        description: app.properties.namingStrategy.generatedModelDeclarationDescriptions.observeRemove(modelName),
        // args: whereArgs,
      })
      subscriptionDeclarations.push({
        ...model,
        propertyName: app.properties.namingStrategy.generatedModelDeclarations.observeOne(modelName),
        description: app.properties.namingStrategy.generatedModelDeclarationDescriptions.observeOne(modelName),
        args: whereArgs,
      })
      subscriptionDeclarations.push({
        ...model,
        array: true,
        propertyName: app.properties.namingStrategy.generatedModelDeclarations.observeMany(modelName),
        description: app.properties.namingStrategy.generatedModelDeclarationDescriptions.observeMany(modelName),
        args: queryArgs,
      })
      subscriptionDeclarations.push({
        ...MetadataUtils.createType("number"),
        propertyName: app.properties.namingStrategy.generatedModelDeclarations.observeCount(modelName),
        description: app.properties.namingStrategy.generatedModelDeclarationDescriptions.observeCount(modelName),
        args: whereArgs,
      })

      // queryDeclarations[app.properties.namingStrategy.generatedModelDeclarations.oneNotNull(modelName)] = args(entity.model, {
      //   where: nullable(whereArgs),
      //   order: nullable(orderArgs),
      // })
      // queryDeclarations[app.properties.namingStrategy.generatedModelDeclarations.many(modelName)] = args(array(entity.model), {
      //   where: nullable(whereArgs),
      //   order: nullable(orderArgs),
      //   offset: nullable(Number),
      //   limit: nullable(Number),
      // })
      // queryDeclarations[app.properties.namingStrategy.generatedModelDeclarations.count(modelName)] = args({ count: Number }, whereArgs)
      //
      // mutationDeclarations[app.properties.namingStrategy.generatedModelDeclarations.save(modelName)] = args(entity.model, whereArgs)
      // mutationDeclarations[app.properties.namingStrategy.generatedModelDeclarations.remove(modelName)] = args({ status: String }, whereArgs)
    }
  }

  // console.log(JSON.stringify(queryDeclarations, undefined, 2));

  return {
    queryResolverSchema,
    mutationResolverSchema,
    subscriptionResolverSchema,
    queryDeclarations,
    mutationDeclarations,
    subscriptionDeclarations,
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
          whereArgs.push(MetadataUtils.createType(property.kind, {
            nullable: true,
            propertyName: property.propertyName,
          }))
        }
      } else {
        const relationWithSuchProperty = entityMetadata.findRelationWithPropertyPath(property.propertyName!)
          if (relationWithSuchProperty && deepness < app.properties.maxGeneratedConditionsDeepness) {
            const reference = app.metadata.models.find(type => type.typeName === property.typeName)
            if (!reference)
              throw new Error(`cannot find a type ${property.typeName}`)

            whereArgs.push(MetadataUtils.createType("object", {
              typeName: app.properties.namingStrategy.generatedModelInputs.whereRelation(type.typeName!!, property.propertyName!!),
              nullable: true,
              propertyName: property.propertyName,
              properties: createModelFromBlueprint(relationWithSuchProperty.inverseEntityMetadata, reference, app, deepness + 1)
            }))
          }
      }
    }
  // }
  return whereArgs
}
