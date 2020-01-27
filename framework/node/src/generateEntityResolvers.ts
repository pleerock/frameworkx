import {
  AnyApplication,
  MetadataUtils,
  TypeMetadata,
} from "@microframework/core";
import {Resolver} from "@microframework/core";
import {EntityMetadata, InsertEvent} from "typeorm";

/**
 * Transforms entities defined in the app to TypeORM entity format.
 * Should be used to pass app entities to TypeORM connection object.
 */
export function generateEntityResolvers(app: AnyApplication) {
  const queryResolverSchema: Resolver[] = [] // ModelResolverSchema<any, any> = {}
  const mutationResolverSchema: Resolver[] = []
  const subscriptionResolverSchema: Resolver[] = []
  const queryDeclarations: TypeMetadata[] = []
  const mutationDeclarations: TypeMetadata[] = []
  const subscriptionDeclarations: TypeMetadata[] = []

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

      subscriptionResolverSchema.push(new Resolver({
        type: "subscription",
        name: app.properties.namingStrategy.generatedModelDeclarations.observeInsert(entity.name),
        resolverFn: {
          triggers: [insertTriggerName]
        }
      }))
      subscriptionResolverSchema.push(new Resolver({
        type: "subscription",
        name: app.properties.namingStrategy.generatedModelDeclarations.observeUpdate(entity.name),
        resolverFn: {
          triggers: [updateTriggerName]
        }
      }))
      subscriptionResolverSchema.push(new Resolver({
        type: "subscription",
        name: app.properties.namingStrategy.generatedModelDeclarations.observeSave(entity.name),
        resolverFn: {
          triggers: [saveTriggerName]
        }
      }))
      subscriptionResolverSchema.push(new Resolver({
        type: "subscription",
        name: app.properties.namingStrategy.generatedModelDeclarations.observeRemove(entity.name),
        resolverFn: {
          triggers: [removeTriggerName]
        }
      }))

      subscriptionResolverSchema.push(new Resolver({
        type: "subscription",
        name: app.properties.namingStrategy.generatedModelDeclarations.observeOne(entity.name),
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
      }))
      subscriptionResolverSchema.push(new Resolver({
        type: "subscription",
        name: app.properties.namingStrategy.generatedModelDeclarations.observeMany(entity.name),
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
      }))
      subscriptionResolverSchema.push(new Resolver({
        type: "subscription",
        name: app.properties.namingStrategy.generatedModelDeclarations.observeCount(entity.name),
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
      }))

      const model = app.metadata.models.find(model => model.typeName === entity.name) // todo: move method to the model itself
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
        propertyName: app.properties.namingStrategy.generatedModelDeclarations.one(entity.name),
        description: app.properties.namingStrategy.generatedModelDeclarationDescriptions.one(entity.name),
        args: queryArgs
      })
      queryDeclarations.push({
        ...model,
        nullable: false,
        propertyName: app.properties.namingStrategy.generatedModelDeclarations.oneNotNull(entity.name),
        description: app.properties.namingStrategy.generatedModelDeclarationDescriptions.oneNotNull(entity.name),
        args: queryArgs
      })
      queryDeclarations.push({
        ...model,
        array: true,
        propertyName: app.properties.namingStrategy.generatedModelDeclarations.many(entity.name),
        description: app.properties.namingStrategy.generatedModelDeclarationDescriptions.many(entity.name),
        args: queryArgs
      })
      queryDeclarations.push({
        ...MetadataUtils.createType("number"),
        propertyName: app.properties.namingStrategy.generatedModelDeclarations.count(entity.name),
        description: app.properties.namingStrategy.generatedModelDeclarationDescriptions.count(entity.name),
        args: whereArgs,
      })
      mutationDeclarations.push({
        ...model,
        propertyName: app.properties.namingStrategy.generatedModelDeclarations.save(entity.name),
        description: app.properties.namingStrategy.generatedModelDeclarationDescriptions.save(entity.name),
        args: whereArgs,
      })
      mutationDeclarations.push({
        ...MetadataUtils.createType("boolean"),
        propertyName: app.properties.namingStrategy.generatedModelDeclarations.remove(entity.name),
        description: app.properties.namingStrategy.generatedModelDeclarationDescriptions.remove(entity.name),
        args: whereArgs,
      })
      subscriptionDeclarations.push({
        ...model,
        propertyName: app.properties.namingStrategy.generatedModelDeclarations.observeInsert(entity.name),
        description: app.properties.namingStrategy.generatedModelDeclarationDescriptions.observeInsert(entity.name),
        // args: whereArgs,
      })
      subscriptionDeclarations.push({
        ...model,
        propertyName: app.properties.namingStrategy.generatedModelDeclarations.observeUpdate(entity.name),
        description: app.properties.namingStrategy.generatedModelDeclarationDescriptions.observeUpdate(entity.name),
        // args: whereArgs,
      })
      subscriptionDeclarations.push({
        ...model,
        propertyName: app.properties.namingStrategy.generatedModelDeclarations.observeSave(entity.name),
        description: app.properties.namingStrategy.generatedModelDeclarationDescriptions.observeSave(entity.name),
        // args: whereArgs,
      })
      subscriptionDeclarations.push({
        ...model,
        propertyName: app.properties.namingStrategy.generatedModelDeclarations.observeRemove(entity.name),
        description: app.properties.namingStrategy.generatedModelDeclarationDescriptions.observeRemove(entity.name),
        // args: whereArgs,
      })
      subscriptionDeclarations.push({
        ...model,
        propertyName: app.properties.namingStrategy.generatedModelDeclarations.observeOne(entity.name),
        description: app.properties.namingStrategy.generatedModelDeclarationDescriptions.observeOne(entity.name),
        args: whereArgs,
      })
      subscriptionDeclarations.push({
        ...model,
        array: true,
        propertyName: app.properties.namingStrategy.generatedModelDeclarations.observeMany(entity.name),
        description: app.properties.namingStrategy.generatedModelDeclarationDescriptions.observeMany(entity.name),
        args: queryArgs,
      })
      subscriptionDeclarations.push({
        ...MetadataUtils.createType("number"),
        propertyName: app.properties.namingStrategy.generatedModelDeclarations.observeCount(entity.name),
        description: app.properties.namingStrategy.generatedModelDeclarationDescriptions.observeCount(entity.name),
        args: whereArgs,
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
